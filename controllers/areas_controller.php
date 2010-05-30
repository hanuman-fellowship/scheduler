<?php
class AreasController extends AppController {

	var $name = 'Areas';
	var $helpers = array('schedule');

	function schedule($id = null) {
		$this->Area->id = $id;
		$this->Area->sContain('Shift.Assignment.Person.ResidentCategory','FloatingShift.Person');
		$this->set('area',$this->Area->sFind('first'));
		
		$this->loadModel('Boundary');
		$this->set('bounds', $this->Boundary->getBounds());
	}

}
?>