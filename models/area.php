<?php
class Area extends AppModel {

	var $name = 'Area';
	var $validate = array(
		'name' => array('notempty'),
		'short_name' => array('notempty')
	);

	var $hasMany = array(
		'FloatingShift',
		'Shift' => array(
			'order' => 'start, end'
		)
	);

	function getArea($id) {
		$this->id = $id;
		$this->sContain('Shift.Assignment.Person.ResidentCategory','FloatingShift.Person');
		$area = $this->sFind('first');
		if (isset($area['Shift'])) {
			foreach($area['Shift'] as &$shift) {
				$shift['Assignment'] = Set::sort($shift['Assignment'],"{n}.Person.resident_category_id","asc");
			}
		}
		return $area;
	}
	
	function sSave($data) {
		$changes = parent::sSave($data);
		$this->setDescription($changes);
	}
	
	function setDescription($changes) {
		if ($changes['oldData']['id'] == '') {
			$this->description = 'New Area created: '.
			"{$changes['newData']['name']} ".
			"({$changes['newData']['short_name']})";
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
	}

}
?>