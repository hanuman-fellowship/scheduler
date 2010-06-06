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
		$this->set('person',$this->Person->getPerson($id));		
		$this->loadModel('Boundary');
		$this->set('bounds', $this->Boundary->getBounds());
	}	
	
	
}
	
?>