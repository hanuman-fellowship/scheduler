<?php
class AreasController extends AppController {

	var $name = 'Areas';
	var $helpers = array('schedule');

	function schedule($id = null) {
		$this->set('area',$this->Area->getArea($id));
		$this->loadModel('Boundary');
		$this->set('bounds', $this->Boundary->getBounds());
	}

}
?>