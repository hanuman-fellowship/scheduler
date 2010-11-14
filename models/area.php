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
	
	function clear($ids, $keep_shifts = false, $internal = false) {
		$areas = (!is_array($ids)) ?  array($ids) : $ids;
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
		return $internal ? $area['Area']['short_name'] :
			"Areas cleared{$keep_shifts}: {$list}";
	}

	function sDelete($ids) {
		$areas = (!is_array($ids)) ?  array($ids) : $ids;
		$list = '';
		foreach($areas as $id) {
			$this->id = $id;
			$list .= $this->clear($id,false,true) . ', ';
			parent::sDelete($id);
		}
		$list = substr($list,0,-2);	
		return "Areas deleted:{$list}";
	}
	
	function description($changes) {
		if (!is_array($changes)) return $changes;
		if (isset($changes['newData'])) {
			if ($changes['oldData']['id'] == '') {
				$desc = "New area created: {$changes['newData']['name']}";
			} else {
				$desc = 'Area changed: '.
				"{$changes['oldData']['name']}";
				$listed = false;
				foreach($changes['newData'] as $field => $val) {
					if ($changes['newData'][$field] != $changes['oldData'][$field]) {
						$desc .= $listed ? ', ' : ' ';
						$desc .= 
							Inflector::humanize($field).':'.$val;
						$listed = true;
					}
				}
			}
		} else {
			$desc = "Area deleted: {$changes['name']}";
		}
		return $desc;
	}

}
?>
