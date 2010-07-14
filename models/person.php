<?php
class Person extends AppModel {

	var $name = 'Person';

	var $hasMany = array(
		'Assignment',
		'FloatingShift',
		'OffDay',
		'ProfileNote'
	);
	
	var $hasOne = array(
		'PeopleSchedules'
	);

//	function sFind($type, $params = array()) {
//		$this->sContain('PeopleSchedules.ResidentCategory');
//		$person = $this->find($type, $params);
//		$newPerson['Person'] = $person['Person'];
//		$newPerson['ResidentCategory'] = $person['PeopleSchedules']['ResidentCategory'];
//		return $newPerson;
//	}
	
	function sSave($data) {
		$changes = $this->save($data);
		if(!isset($data['Person']['id'])) { // if this is a new person
			$noteData = array('ProfileNote' => array(
				'person_id' => $this->id,
				'note' =>      'Person Created'
			));
			$this->ProfileNote->create();
			$this->ProfileNote->save($noteData);
			$this->PeopleSchedules->schedule_id = $this->schedule_id;
			$this->PeopleSchedules->sSave(array(
				'PeopleSchedules' => array(
					'person_id' =>            $this->id,
					'resident_category_id' => 1
				)
			));
		}
	}
	
	function sDelete($id) {
		$this->id = $id;
		$this->Assignment->schedule_id = $this->schedule_id;
		$this->sContain('Assignment');
		$person = $this->sFind('first');
		foreach($person['Assignment'] as $assignment) {
			$this->Assignment->sDelete($assignment['id']);
		}
		$changes = parent::sDelete($id);
		$this->setDescription($changes);
	}
	
	function setDescription($changes) {
		if (isset($changes['newData'])) {
			if ($changes['oldData']['id'] == '') {
				$this->description = "New person created: {$changes['newData']['name']}";
			} else {
				$this->description = 'Person changed: '.
				"{$changes['oldData']['name']}";
				$listed = false;
				foreach($changes['newData'] as $field => $val) {
					if ($changes['newData'][$field] != $changes['oldData'][$field]) {
						$this->description .= $listed ? ', ' : ' ';
						$this->description .= 
							Inflector::humanize($field).' is now '.$val;
						$listed = true;
					}
				}
			}
		} else {
			$this->description = "Person deleted: {$changes['name']}";
		}
	}
	
	
	function getPerson($id) {
		$this->sContain(
			'Assignment.Shift.Area',
			'PeopleSchedules.ResidentCategory',
			'OffDay',
			'FloatingShift.Area'
		);
		$person = $this->find('first',array(
			'conditions' => array('Person.id'=>$id)
		));
		return $person;
	}	

	function available($shift_id) {
		$this->Assignment->Shift->id = $shift_id;
		$this->Assignment->Shift->recursive = -1;
		$shift = $this->Assignment->Shift->sFind('first');
		$this->sContain('OffDay','Assignment.Shift','PeopleSchedules.ResidentCategory');
		$this->order = array('Person.first');
		$people = $this->find('all');
		$list = array();
		foreach($people as $person_num => $person) {
			$list[$person_num] = $person['Person'];
			$list[$person_num]['ResidentCategory'] = $person['PeopleSchedules']['ResidentCategory'];
			$list[$person_num]['available'] = true; // benefit of the doubt
			foreach($person['OffDay'] as $OffDay) {
				
				if ($shift['Shift']['day_id'] == $OffDay['day']) {
					$list[$person_num]['available'] = false; // it's their off day
					continue;
				}
			}
			foreach($person['Assignment'] as $assignment) {
				$a = $shift['Shift'];
				$b = $assignment['Shift'];
				if ($a['id'] == $b['id']) {
					$list[$person_num]['available'] = false; // they are already on that shift
					continue;
				}
				if (
					($a['day_id'] == $b['day_id']) && ( // the shifts are on the same day AND
						($a['start'] >= $b['start'] && $a['start'] <= $b['end']) || // a starts during b or
						($b['start'] >= $a['start'] && $b['start'] <= $a['end'])    // b starts during a
					)
				) {
					$list[$person_num]['available'] = false; // they have are on a conflicting shift
					continue;
				}
			}
		}
		return $list;
	}

	function getPeople($ids = null) {
		if(is_array($ids)) {
			$people = array();
			$i = 0;
			foreach($ids as $id => $schedule_id) {
				$people[$i][0]['schedule_id'] = $schedule_id;
				$people[$i]['Person']['id'] = $id;
				$i++;
			}
		} else {
			$this->recursive = -1;
			$this->order = 'Person.name';
			$people = $this->find('all',array(
			'fields' => array(
				'Person.id',
				'MAX(Person.schedule_id) as schedule_id'
			),
			'group' => 'Person.id',
			));
		}
		$allPeople = array();
		foreach ($people as $person) {
			$this->schedule_id = $person[0]['schedule_id'];
			$this->ResidentCategory->schedule_id = $person[0]['schedule_id'];
			$this->sContain('ResidentCategory');
			$this->id = $person['Person']['id'];
			$allPeople[] = $this->sFind('first');
		}
		return $allPeople;
	}

}
?>
