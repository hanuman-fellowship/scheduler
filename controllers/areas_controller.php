<?php
class AreasController extends AppController {

	var $name = 'Areas';
	var $helpers = array('schedule');

	function schedule($id = null) {
		$this->set('area',$this->Area->getArea($id));
		$this->loadModel('Boundary');
		$this->set('bounds', $this->Boundary->getBounds());
	}
	
	function add($area_id = null) {
		if (!empty($this->data)) {
			$this->Area->create();
			$this->record();
			$this->Area->sSave($this->data);
			$this->stop($this->Area->description);
			$this->redirect(array('controller' => 'areas', 'action' => 'schedule', $this->data['Area']['id']));
		}
	}
	
	function edit($id = null) {
		if (!empty($this->data)) {
			$this->record();
			$this->Area->sSave($this->data);
			$this->stop($this->Area->description);
			$this->redirect(array('controller' => 'areas', 'action' => 'schedule', $this->data['Area']['id']));
		}
		if (empty($this->data)) {
			$this->id = $id;
			$this->data = $this->Area->sFind('first');
		}
	}

}
?>