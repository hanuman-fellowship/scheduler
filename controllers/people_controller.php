<?php
class PeopleController extends AppController {

	var $name = 'People';
	var $scaffold;
	var $helpers = array('schedule');
		
	/**
	 * Displays the schedule for the specified person.
	 * 
	 */
	function schedule($id = null) {	
		$this->Person->id = $id;
		$this->Person->contain('Assignment.Shift.Area','ResidentCategory','OffDay','FloatingShift.Area');
		$this->set('person',$this->Person->sFind('first'));
		
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