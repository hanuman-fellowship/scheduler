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

  var $actsAs = array('Linkable');

	function valid($data) {
		if (trim($data['Person']['first']) == '') {
			$this->errorField = 'first';
			$this->errorMessage = "First name must not be blank";
			return false;
		}	
		if (trim($data['Person']['last']) == '') {
			$this->errorField = 'last';
			$this->errorMessage = "Last name must not be blank";
			return false;
		}	
		if (!ctype_alpha(str_replace(' ','',$data['Person']['first']))) {
			$this->errorField = 'first';
			$this->errorMessage = "First name must be letters only";
			return false;
		}	
		if (!ctype_alpha(str_replace(' ','',$data['Person']['last']))) {
			$this->errorField = 'last';
			$this->errorMessage = "Last name must be letters only";
			return false;
		}	
		if (!isset($data['Person']['id']) &&
		    $this->findByFirst(trim($data['Person']['first'])) &&
		    $this->findByLast(trim($data['Person']['last']))) {
			$this->errorField = 'last';
			$this->errorMessage = 'Person exists. Try "Restore"';
			return false;
		}
		return true;
	}

	function sSave($data) {
		$this->save($data);
		if(!isset($data['Person']['id'])) { // if this is a new person
			$this->addPeopleSchedules($this->id, $data['Person']['resident_category_id']);
			$description = "Person created: {$data['Person']['first']} {$data['Person']['last']}";
		}
		deleteCache('people');
		return isset($description)? $description : '';
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
	
	function restore($id, $category) {
		$this->PeopleSchedules->restore = true;
		$this->addPeopleSchedules($id, $category);	
		deleteCache('people');
		$person = $this->findById($id);
		return "Person restored: {$person['Person']['first']} {$person['Person']['last']}";
	}

	function addPeopleSchedules($person_id, $rcId = 1) {
		$this->PeopleSchedules->sSave(array(
			'PeopleSchedules' => array(
				'person_id' =>            $person_id,
				'resident_category_id' => $rcId
			)
		));
	}

	function getNameFromPeopleSchedulesId($id) {
		$peopleSchedules = $this->PeopleSchedules->sFind('first', array('conditions' => array(
			'PeopleSchedules.id' => $id
		)));
		return $this->getName($peopleSchedules['PeopleSchedules']['person_id']);
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

	function getPerson($id, $simple = false) {
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
		$this->order = array('PeopleSchedules.resident_category_id','Person.first','Person.last');
		$people = $this->find( is_array($id)? 'all' : 'first',array(
			'conditions' => array('Person.id' => $id)
		));
		if (array_key_exists("Person",$people)) { // it's only one person
			$people = array($people);
		}
		foreach($people as &$person) {

			$this->addDisplayName($person['Person']);
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
		}
		return (count($people) == 1)? $people[0] : $people;
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
		$people = $this->getPerson($this->getCurrent());
		$this->categorySort($people);
		$people = Set::combine($people,'{n}.Person.id','{n}','{n}.PeopleSchedules.resident_category_id');
		foreach ($people as &$category) {
			$category = Set::sort(array_values($category),'{n}.Person.name','asc');
		}
		return $people;
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
		$this->categorySort($people);
		$list = array();
		foreach($people as $person_num => $person) {
			$this->addDisplayName($person['Person']);
			$list[$person_num]['Person'] = $person['Person'];
			$list[$person_num]['ResidentCategory'] = $person['PeopleSchedules']['ResidentCategory'];
			$list[$person_num]['available'] = $this->available($person, $shift); 
		}
		$list = Set::combine($list,'{n}.Person.id','{n}','{n}.ResidentCategory.id');
		foreach ($list as &$category) {
			$category = Set::sort(array_values($category),'{n}.Person.name','asc');
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

		$this->order = array('PeopleSchedules.resident_category_id');
		$this->sContain(
			'PeopleSchedules.ResidentCategory'
		);
		$people = $this->find('all',array(
			'conditions' => array(
				'Person.id' => $currentPeople
			)
		));
		$this->addDisplayNamesAll($people);
		$this->categorySort($people);
		$people = $simple ?
			Set::combine($people,'{n}.Person.id','{n}.Person.name','{n}.PeopleSchedules.resident_category_id') :
			Set::combine($people,'{n}.Person.id','{n}','{n}.PeopleSchedules.resident_category_id');
		foreach ($people as &$category) {
			if ($simple) {
				asort($category);
			} else {
				$category = Set::sort(array_values($category),'{n}.Person.name','asc');
			}
		}
		if ($simple) {
			$simplePeople = array();
			foreach ($people as $cat) {
				$simplePeople += $cat;
			}
			return $simplePeople;
		}
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
		if (!checkCache('people.names')) {
			$people = $this->getPeople();
			foreach($people as $key => $prsn) {
				if ($prsn['Person']['display_name']) unset($people[$key]);
			}
			writeCache('people.names',
				Set::combine($people,'{n}.Person.id','{n}.Person.last','{n}.Person.first'));
		}

		if ($person['display_name']) {
			$person['name'] = $person['display_name'];
			return;
		}
		$person['name'] = $person['first'];

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
			'order' => array('Person.first', 'Person.last')
		));
	}

	function addAssignedPeople(&$data,$request = '') {
		if (!isset($data[$request.'Shift'])) {
			return;
		}
		$currentPeople = $this->getCurrent();
		foreach($data[$request.'Shift'] as &$shift) {
			$people_ids = array();
			$stars = array();
			$other_assignments = array();
			foreach($shift[$request.'Assignment'] as &$assignment) {
				if (in_array($assignment['person_id'], $currentPeople)) {
					$people_ids[$assignment['id']] = $assignment['person_id'];
					$stars[$assignment['id']] = $assignment['star'];
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
						$request.'Assignment' => array(
							'id' => $assignment['id'],
							'star' => $assignment['star'])
					);
				}
			}
			$this->sContain('PeopleSchedules.ResidentCategory');
			$people = $this->find('all',array(
				'conditions' => array('Person.id' => $people_ids),
				'order' => 'PeopleSchedules.resident_category_id, Person.first, Person.last'
			));
			$this->categorySort($people);
			foreach($people as &$person) {
				$this->addDisplayName($person['Person']);
				$person[$request.'Assignment']['id'] = array_search($person['Person']['id'],$people_ids);
				$person[$request.'Assignment']['star'] = $stars[$person[$request.'Assignment']['id']];
			}
			$categories = Set::combine($people,'{n}.Person.id','{n}','{n}.PeopleSchedules.resident_category_id');
			$people = array();
			foreach($categories as $category) {
				$people = array_merge($people,Set::sort(array_values($category),'{n}.Person.name','asc'));
			}
			$shift[$request.'Assignment'] = array_merge($people, $other_assignments);
		}
	}

	function getChanged($since = null) {
		$since = $since ? date('Y-m-d H:i:s',$since) : 0;
		$changed = array();
		$this->Change = ClassRegistry::init('Change');
		$this->Change->id = '';
		$this->Change->sContain('ChangeModel.ChangeField');
		$changes = $this->Change->sFind('all',array(
			'conditions' => array(
				'Change.undone' => 0,
				'Change.created >=' => $since
			)
		));
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
						$skip = true;
						foreach($changeModel['ChangeField'] as $changeField) {
							if ($changeField['field_key'] != 'num_people') {
								if ($changeField['field_old_val'] != $changeField['field_new_val']) {
									$skip = false;
								}
							}
						}
						if ($skip) break;
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

	function categorySort(&$people) {
		if ($this->PeopleSchedules->ResidentCategory->field('sort_order',array('schedule_id' => scheduleId()),'sort_order desc') > 0) {
			$people = Set::sort($people,'{n}.PeopleSchedules.ResidentCategory.sort_order','asc');
		}
	}

  function timesHere($id) {
    $this->Schedule = ClassRegistry::init('Schedule');
    $schedules = $this->Schedule->find('all', array(
      'link' => array('PeopleSchedules', 'ScheduleGroup'),
      'conditions' => array(
        'PeopleSchedules.person_id' => $id,
        'Schedule.schedule_group_id <>' => '0',
        'Schedule.name' => 'Published'
      ),
      'order' => 'ScheduleGroup.start asc'
    ));
    $times = array();
    $i = 0;
    foreach($schedules as $schedule) {
      $scheduleStart = $schedule['ScheduleGroup']['start'];
      $scheduleEnd   = $schedule['ScheduleGroup']['end'];
      if (!isset($times[$i])) {
        $times[$i]['start'] = $scheduleStart;
        $times[$i]['end']   = $scheduleEnd;
      } else {
        $date1 = new DateTime($scheduleStart);
        $date2 = new DateTime($times[$i]['end']);
        $interval = $date1->diff($date2, true);
        if (strtotime($scheduleEnd) <= strtotime($times[$i]['end'])) {
          continue;
        } else {
          if ($interval->days < 14) {
            $times[$i]['end'] = $scheduleEnd;
          } else {
            $i++;
            $times[$i]['start'] = $scheduleStart;
            $times[$i]['end']   = $scheduleEnd;
          }
        }
      }
    }
    return $times;
  }

}
?>
