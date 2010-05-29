<?php
class AreasController extends AppController {

	var $name = 'Areas';
	var $helpers = array('schedule');

	function schedule($id = null) {
		$this->Area->id = $id;
		$this->Area->sContain('Shift.Assignment.Person.ResidentCategory','FloatingShift.Person');
		$this->set('area',$this->Area->sFind('first'));
		
		$this->loadModel('Boundary');
		$this->Boundary->sContain('Day','Slot');
		$bounds = $this->Boundary->sFind('all');				
		$this->set('days',
			Set::combine($bounds,
				'{n}.Day.id','{n}.Day.name'
			)
		);
		$this->set('slots',
			Set::combine($bounds,
				'{n}.Slot.id','{n}.Slot.name'
			)
		);
		$this->set('bounds',
			Set::combine($bounds,
				'{n}.Boundary.day_id',"{n}.Boundary", '{n}.Boundary.slot_id'
			)
		);
	}

}
?>