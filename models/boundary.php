<?php
class Boundary extends AppModel {

	var $name = 'Boundary';

	var $belongsTo = array(
		'Day',
		'Slot'
	);
	
	function getBounds() {
		$this->sContain('Day','Slot');
		$bounds = $this->sFind('all');				
		$days = Set::combine($bounds,'{n}.Day.id','{n}.Day.name');
		$slots = Set::combine($bounds,'{n}.Slot.id','{n}.Slot.name');
		$bounds = Set::combine($bounds,'{n}.Boundary.day_id',"{n}.Boundary", '{n}.Boundary.slot_id');
		return compact('days','slots','bounds');
	}

}
?>