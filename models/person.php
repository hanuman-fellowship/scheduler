<?php
class Person extends AppModel {

	var $name = 'Person';

	var $hasMany = array(
		'Assignment',
		'FloatingShift',
		'OffDay',
		'PersonnelNote',
		'OperationsNote'
	);
	
	var $hasOne = array(
		'PeopleSchedules'
	);

	function valid($data) {
		if (trim($data['Person']['first']) == '') {
			$this->errorField = 'first';
			$this->errorMessage = "First name must not be blank";
			return false;
		}	
		if (!ctype_alpha(str_replace(' ','',$data['Person']['first']))) {
			$this->errorField = 'first';
			$this->errorMessage = "First name must be letters only";
			return false;
		}	
		return true;
	}

	function description($changes) {
		if (!is_array($changes)) return $changes;
	}

	function sSave($data) {
		$resident_category_id = $data['Person']['resident_category_id'];
		unset($data['Person']['resident_category_id']);
		$this->save($data);
		if(!isset($data['Person']['id'])) { // if this is a new person
			$this->addPeopleSchedules($this->id, $resident_category_id);
		} else {
			$peopleSchedules = $this->PeopleSchedules->sFind('first', array(
				'recursive' => -1,
				'conditions' => array('PeopleSchedules.person_id' => $data['Person']['id'])
			));
			$peopleSchedules['PeopleSchedules']['resident_category_id'] = $resident_category_id;
			$this->PeopleSchedules->sSave($peopleSchedules);
		}
	}
	
	function retireMany($data) {
		$peopleIds = array();
		foreach($data['Person'] as $category) {
			if (is_array($category)) {
				$peopleIds = array_merge($peopleIds,array_values($category));
			}
		}
		$list = '';
		foreach($peopleIds as $personId) {
			$list .= $this->retire($personId,true) . ', ';
		}
		$list = substr($list,0,-2);	
		return "People retired: {$list}";
	}

	function retire($id, $internal = false) {
		$this->sContain('Assignment','FloatingShift');
		$person = $this->find('first',array(
			'conditions' => array('Person.id' => $id)
		));
		foreach($person['Assignment'] as $assignment) {
			$this->Assignment->sDelete($assignment['id']);
		}
		foreach($person['FloatingShift'] as $floatingShift) {
			$this->FloatingShift->sDelete($floatingShift['id']);
		}
		$changes = $this->PeopleSchedules->sDelete($this->getPeopleSchedulesId($id));
		$this->addDisplayName($person['Person']);
		return $internal ? $person['Person']['name'] : $changes;
	}
	
	function restore($id) {
		$this->PeopleSchedules->restore = true;
		// get the latest PeopleSchedules entry for this person
		$latest = $this->PeopleSchedules->find('first', array(
			'conditions' => array('PeopleSchedules.person_id' => $id),
			'order' => 'PeopleSchedules.schedule_id desc',
			'recursive' => -1
		));
		if (!$latest) { // if there is no entry, make one. Otherwise copy the latest
			$this->addPeopleSchedules($id);	
		} else {
			$this->addPeopleSchedules($id, $latest['PeopleSchedules']['resident_category_id']);	
		}
	}

	function addPeopleSchedules($person_id, $rcId = 1) {
		$this->PeopleSchedules->sSave(array(
			'PeopleSchedules' => array(
				'person_id' =>            $person_id,
				'resident_category_id' => $rcId
			)
		));
	}

	function getName($person_id) {
		$person = $this->find('first',array(
			'recursive' => -1,
			'conditions' => array(
				'Person.id' => $person_id
			)
		));
		$this->addDisplayName($person['Person']);
		return $person['Person']['name'];
	}

	function getPerson($id,$simple = false) {
		if ($simple) {
			$this->sContain(
				'PeopleSchedules.ResidentCategory'
			);
		} else {
			$this->sContain(
				'Assignment',
				'PeopleSchedules.ResidentCategory.ConstantShift',
				'OffDay',
				'FloatingShift.Area'
			);
		}
		$person = $this->find('first',array(
			'conditions' => array('Person.id' => $id)
		));
		$this->Assignment->Shift->addAssignedShifts($person);

		// move the constant shifts into place with the other shifts
		if (!isset($person['PeopleSchedules']['ResidentCategory']['ConstantShift'])) {
			$person['PeopleSchedules']['ResidentCategory']['ConstantShift'] = array();
		}
		foreach($person['PeopleSchedules']['ResidentCategory']['ConstantShift'] as $constant) {
			foreach($person['Assignment'] as $offset => $assignment) {
				if (!isset($assignment['Shift'])) {
					continue;
				}
				if ($assignment['Shift']['day_id'] === $constant['day_id']) {
					if ($assignment['Shift']['start'] >= $constant['start']) {
						continue;
					}
					$insert = $offset + 1;
					break;
				}
			}
			if (isset($insert)) {
				array_splice($person['Assignment'],
					$insert,0,array(array('ConstantShift'=>$constant)));
				unset($insert);
			} else {
				$person['Assignment'][] = array('ConstantShift'=>$constant);
			}
		}
		unset ($person['PeopleSchedules']['ResidentCategory']['ConstantShift']);
		return $person;
	}	

	function getGaps() {
		$this->Assignment->Shift->order = 'Shift.start, Shift.end, Area.short_name';
		$this->Assignment->Shift->contain(array(
			'Assignment' => array(
				'conditions' => "Assignment.schedule_id = ". scheduleId(),
				'fields' => array('shift_id')
			),
			'Area' => array(
				'conditions' => "Area.schedule_id = ". scheduleId()
			)
		));
		$shifts = $this->Assignment->Shift->sFind('all');
		$assignments = array();
		foreach($shifts as $shift) {
			$numAvail = $shift['Shift']['num_people'] - count($shift['Assignment']);
			if ($numAvail > 0) {
				$shift['Shift']['num'] = $numAvail;
				$shift['Shift']['Area'] = $shift['Area'];
				$assignments[]['Shift'] = $shift['Shift'];	
			}
		}
		return array(
			'PeopleSchedules' => array(
				'ResidentCategory' => array(
					'name' => 'GAPS'
				)
			),
			'Assignment' => $assignments
		);
	}

	function getBoard() {
	}

	function getAvailable($shift_id) {
		$this->Assignment->Shift->id = $shift_id;
		$this->Assignment->Shift->recursive = -1;
		$shift = $this->Assignment->Shift->sFind('first');

		$currentPeople = $this->getCurrent();

		$this->sContain('OffDay','Assignment.Shift','PeopleSchedules.ResidentCategory.ConstantShift');
		$this->order = 'PeopleSchedules.resident_category_id, Person.first, Person.last';
		$people = $this->find('all',array(
			'conditions' => array(
				'Person.id' => $currentPeople
			)
		));

		$list = array();
		foreach($people as $person_num => $person) {
			$this->addDisplayName($person['Person']);
			$list[$person_num] = $person['Person'];
			$list[$person_num]['ResidentCategory'] = $person['PeopleSchedules']['ResidentCategory'];
			$list[$person_num]['available'] = $this->available($person, $shift); 
		}
		return $list;
	}
	
	/**
	 * returns true if the person is available for the shift or -1 if the person is on the shift
	 * $person must contain 'Person', 'PeopleSchedules', 'OffDay', 'Assignment.Shift'
	 * $shift must contain 'Shift'
	 *
	 */
	function available($person, $shift) {
		$this->ConstantShift = &$this->PeopleSchedules->ResidentCategory->ConstantShift;
		$constantShifts = $this->ConstantShift->sFind('all', array(
			'recursive' => -1,
			'conditions' => array(
				'ConstantShift.resident_category_id' => $person['PeopleSchedules']['resident_category_id']
			)
		));
		// add constant shifts into the person array as regular shifts for the sake of conflicts
		foreach($constantShifts as $constantShift) {
			$person['Assignment'][] = array('Shift' => $constantShift['ConstantShift']);
		}
		$result = true;
		foreach($person['Assignment'] as $assignment) {
			$a = $shift['Shift'];
			$b = $assignment['Shift'];
			if ($a['id'] == $b['id']) {
				return -1; // don't even show when ignoring conflicts
			}
			if (
				($a['day_id'] == $b['day_id']) && ( // the shifts are on the same day AND
					($a['start'] >= $b['start'] && $a['start'] <= $b['end']) || // a starts during b or
					($b['start'] >= $a['start'] && $b['start'] <= $a['end'])    // b starts during a
				)
			) {
				$result = false;
			}
		}
		foreach($person['OffDay'] as $OffDay) {
			if ($shift['Shift']['day_id'] == $OffDay['day_id']) {
				$result = false;
			}
		}
		return $result;
	}

	function getPeople() {
		$currentPeople = $this->getCurrent();

		$this->order = 'Person.first, Person.last';
		$conditions = array('Person.id' => $currentPeople);
		$this->sContain(
			'PeopleSchedules.ResidentCategory'
		);
		$people = $this->find('all',array(
			'conditions' => $conditions
		));
		return $people;
	}

	function getList($order = 'Person.first, Person.last') {
		$currentPeople = $this->getCurrent();

		$this->order = $order;
		$this->recursive = -1;
		$people = $this->find('all',array(
			'conditions' => array(
				'Person.id' => $currentPeople
			)
		));
		$this->addDisplayNamesAll($people);
		$people = Set::combine($people, '{n}.Person.id', '{n}.Person.name');
		return $people;
	}

	function listByResidentCategory($simple = false) {	
		$currentPeople = $this->getCurrent();

		$this->order = array('PeopleSchedules.resident_category_id','Person.first','Person.last');
		$this->sContain(
			'PeopleSchedules.ResidentCategory'
		);
		$people = $this->find('all',array(
			'conditions' => array(
				'Person.id' => $currentPeople
			)
		));
		$this->addDisplayNamesAll($people);
		$people = $simple ?
			Set::combine($people,'{n}.Person.id','{n}.Person.name') :
			Set::combine($people,'{n}.Person.id','{n}','{n}.PeopleSchedules.resident_category_id');
		return $people;
	}

	function getCurrent() {
		if (checkCache('people.current')) {
			return readCache('people.current');
		}
		$currentPeople = $this->PeopleSchedules->find('all',array(
			'conditions' => array('PeopleSchedules.schedule_id' => scheduleId()),
			'fields' => array('distinct PeopleSchedules.person_id')
		));
		$currentPeople = Set::combine(
			$currentPeople,
			'{n}.PeopleSchedules.person_id',
			'{n}.PeopleSchedules.person_id'
		);
		writeCache('people.current',$currentPeople);
		return $currentPeople;
	}

	function getPeopleSchedulesId($id) {
		return $this->PeopleSchedules->field('id',array(
			'PeopleSchedules.person_id' => $id,
			'PeopleSchedules.schedule_id' => scheduleId()
		));
	}

	function addDisplayName(&$person) {
		// first time this function is called, set up a list of people's last names grouped by first name
		$person['name'] = ($person['name']) ? $person['name'] : $person['first'];
		if (!checkCache('people.names')) {
			writeCache('people.names',
				Set::combine($this->getPeople(),'{n}.Person.id','{n}.Person.last','{n}.Person.first'));
		}

		// now find out how many letters of the last name we need for each first name
		$lastNames = readCache("people.names.{$person['first']}");
		if (!isset($lastNames['numLetters']) && $lastNames) {
			$others = $lastNames;
			unset($others[$person['id']]); // don't compare with itself
			$numLetters = 0;
			if (count($others) != 0) {	
				$numLetters++; // there's another with this first name, so at least use 1 letter of last
			}
			foreach ($others as $id => $other) {
				if ($person['last']) {
					while (substr($person['last'], 0, $numLetters) == substr($other, 0, $numLetters)) {
						$numLetters++; // up to this letter the lasts are the same, so use one more
					}
				}
			$lastNames['numLetters'] = $numLetters;
			}
		}
		$lastNames['numLetters'] = isset($lastNames['numLetters']) ? $lastNames['numLetters'] : 0;
		$shortLast = substr($person['last'], 0, $lastNames['numLetters']);
		$person['name'] .= ($lastNames['numLetters'] > 0) ? " {$shortLast}" : '';
		writeCache("people.names.{$person['first']}",$lastNames);
	}

	function addDisplayNamesAll(&$people) {
		foreach($people as &$person) {
			$this->addDisplayName($person['Person']);
		}
	}

	function getRestorable() {
		$currentPeople = $this->getCurrent();
		return $this->find('all',array(
			'conditions' => array('NOT' => array('Person.id' => $currentPeople)),
			'recursive' => -1,
			'order' => array('Person.last', 'Person.first')
		));
	}

	function addAssignedPeople(&$data,$request = '') {
		if (!isset($data[$request.'Shift'])) {
			return;
		}
		$currentPeople = $this->getCurrent();
		foreach($data[$request.'Shift'] as &$shift) {
			$people_ids = array();
			$other_assignments = array();
			foreach($shift[$request.'Assignment'] as &$assignment) {
				if (in_array($assignment['person_id'], $currentPeople)) {
					$people_ids[$assignment['id']] = $assignment['person_id'];
				}
				if ($assignment['person_id'] == 0) {
					$other_assignments[] = array(
						'Person' => array(
							'id' => 0,
							'name' => $assignment['name']
						),
						'PeopleSchedules' => array(
							'resident_category_id' => 0
						),
						$request.'Assignment' => array('id' => $assignment['id'])
					);
				}
			}
			$this->sContain('PeopleSchedules.ResidentCategory');
			$people = $this->find('all',array(
				'conditions' => array('Person.id' => $people_ids),
				'order' => 'PeopleSchedules.resident_category_id, Person.first, Person.last'
			));
			foreach($people as &$person) {
				$this->addDisplayName($person['Person']);
				$person[$request.'Assignment']['id'] = array_search($person['Person']['id'],$people_ids);
			}
			$shift[$request.'Assignment'] = array_merge($people, $other_assignments);
		}
	}

	function getChanged($since = null) {
		$since = $since ? date('Y-m-d H:i:s',$since) : 0;
		$changed = array();
		$this->Change = ClassRegistry::init('Change');
		$this->Change->nudge(1); // move the ids up 1 so that the first one is not 0
		$this->Change->id = '';
		$this->Change->sContain('ChangeModel.ChangeField');
		$changes = $this->Change->sFind('all',array(
			'conditions' => array(
				'Change.id >=' => 1,
				'Change.created >=' => $since
			)
		));
		$this->Change->nudge(-1); // move them back
		foreach($changes as $change) {
			foreach($change['ChangeModel'] as $changeModel) {
				switch ($changeModel['name']) {
					case 'PeopleSchedules' :
					case 'Assignment' :
					case 'OffDay' :
					case 'FloatingShift' :
						foreach($changeModel['ChangeField'] as $changeField) {
							if ($changeField['field_key'] == 'person_id') {
								foreach(array('field_old_val','field_new_val') as $field) {
									if ($changeField[$field]) {
										$changed[$changeField[$field]][$change['Change']['id']] = $change['Change']['description'];
									}
								}
							}
						}
						break;
					case 'Shift' :
						$this->Assignment->id = '';
						if ($assignments = $this->Assignment->sFind('all',array(
							'recursive' => -1,
							'conditions' => array('Assignment.shift_id' => $changeModel['record_id']),
							'fields' => array('Assignment.person_id')
						))) {
							foreach($assignments as $assignment) {
								$changed[$assignment['Assignment']['person_id']][$change['Change']['id']] = $change['Change']['description'];
							}
						}
						break;
				}
			}
		}
		return $changed;
	}
}
?>
