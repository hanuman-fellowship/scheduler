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
		debug($changes);
	}

}
?>