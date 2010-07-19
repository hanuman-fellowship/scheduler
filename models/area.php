<?php
class Area extends AppModel {

	var $name = 'Area';

	var $hasMany = array(
		'FloatingShift',
		'Shift' => array(
			'order' => 'start, end'
		)
	);

	function getArea($id) {
		$this->id = $id;
		$this->Shift->Assignment->Person->schedule_id = $this->schedule_id;
		$this->sContain('Shift.Assignment','FloatingShift.Person');
		$area = $this->sFind('first');
		if (isset($area['Shift'])) {
			foreach($area['Shift'] as &$shift) {
				$people_ids = array();
				foreach($shift['Assignment'] as &$assignment) {
					$people_ids[$assignment['id']] = $assignment['person_id'];
				}
				$this->Shift->Assignment->Person->sContain('PeopleSchedules.ResidentCategory');
				$people = $this->Shift->Assignment->Person->find('all',array(
					'conditions' => array('Person.id' => $people_ids),
					'order' => 'PeopleSchedules.resident_category_id, Person.first, Person.last'
				));
				foreach($people as &$person) {
					$this->Shift->Assignment->Person->addDisplayName($person['Person']);
					$person['Assignment']['id'] = array_search($person['Person']['id'],$people_ids);
				}
				$shift['Assignment'] = $people;
			}
		}
		return $area;
	}
	
	function sSave($data) {
		$changes = parent::sSave($data);
		$this->setDescription($changes);
	}
	
	function sDelete($id) {
		$this->id = $id;
		$this->Shift->schedule_id = $this->schedule_id;
		$this->sContain('Shift');
		$area = $this->sFind('first');
		foreach($area['Shift'] as $shift) {
			$this->Shift->sDelete($shift['id']);
		}
		$changes = parent::sDelete($id);
		$this->setDescription($changes);
	}
	
	function setDescription($changes) {
		if (isset($changes['newData'])) {
			if ($changes['oldData']['id'] == '') {
				$this->description = "New area created: {$changes['newData']['name']}";
			} else {
				$this->description = 'Area changed: '.
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
			$this->description = "Area deleted: {$changes['name']}";
		}
	}

}
?>
