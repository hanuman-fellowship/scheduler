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
		$this->Person = &$this->Shift->Assignment->Person;
		$this->Person->schedule_id = $this->schedule_id;
		$this->sContain('Shift.Assignment','FloatingShift.Person.PeopleSchedules.ResidentCategory');
		$area = $this->sFind('first');
		if (isset($area['FloatingShift'])) {
			foreach($area['FloatingShift'] as &$floating_shift) {
				$this->Person->addDisplayName($floating_shift['Person']);
			}
		}
		$this->Person->addAssignedPeople($area);
		$this->RequestArea = ClassRegistry::init('RequestArea');
		$area['hasRequest'] = $this->RequestArea->field('id',array('RequestArea.id'=>$id)) ? true : false;
		return $area;
	}
	
	function sSave($data) {
		$changes = parent::sSave($data);
		$this->setDescription($changes);
	}
	
	function sDelete($id) {
		$this->id = $id;
		$this->Shift->schedule_id = $this->schedule_id;
		$this->clear($id);
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
							Inflector::humanize($field).':'.$val;
						$listed = true;
					}
				}
			}
		} else {
			$this->description = "Area deleted: {$changes['name']}";
		}
	}

	function clear($area_ids, $keep_shifts = false) {
		$areas = (!is_array($area_ids)) ?  array($area_ids) : $area_ids;
		$this->Shift->schedule_id = $this->schedule_id;
		$this->FloatingShift->schedule_id = $this->schedule_id;
		$list = '';
		foreach($areas as $area_id) {
			$this->id = $area_id;
			$this->sContain('Shift','FloatingShift');
			$area = $this->sFind('first');
			foreach($area['Shift'] as $shift) {
				if ($keep_shifts) {
					$this->Shift->clear($shift['id']);
				} else {
					$this->Shift->sDelete($shift['id']);
				}
			}
			foreach($area['FloatingShift'] as $floatingShift) {
				$this->FloatingShift->sDelete($floatingShift['id']);
			}
			$list .= $area['Area']['short_name'] . ', ';	
		}
		$list = substr($list,0,-2);	
		$keep_shifts = $keep_shifts ? ' (shifts kept)' : '';
		$this->description = "Areas cleared{$keep_shifts}: {$list}";
	}
}
?>
