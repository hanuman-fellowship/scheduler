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
		$this->set('bounds', $this->Boundary->getBounds());
	}	
}
	
?>