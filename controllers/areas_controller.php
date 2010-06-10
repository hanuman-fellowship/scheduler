<?php
class AreasController extends AppController {

	var $name = 'Areas';
	var $helpers = array('schedule');

	function schedule($id = null) {
		if ($id) {
			$this->set('area',$this->Area->getArea($id));
			$this->loadModel('Boundary');
			$this->set('bounds', $this->Boundary->getBounds());
		} else {
			$this->redirect(array('controller'=>'areas','action'=>'select'));
		}
	}
	
	function add($area_id = null) {
		if (!empty($this->data)) {
			$this->Area->create();
			$this->record();
			$this->Area->sSave($this->data);
			$this->stop($this->Area->description);
			$this->redirect(array('controller' => 'areas', 'action' => 'schedule', $this->Area->id));
		}
	}
	
	function edit($id = null) {
		if (!empty($this->data)) {
			$this->record();
			$this->Area->sSave($this->data);
			$this->stop($this->Area->description);
			$this->redirect(array('controller' => 'areas', 'action' => 'schedule', $this->Area->id));
		}
		if (empty($this->data)) {
			$this->id = $id;
			$this->data = $this->Area->sFind('first');
		}
	}
	
	function delete($id) {
		$this->record();
		$this->Area->sDelete($id);
		$this->stop($this->Area->description);
		$this->redirect('/areas/schedule/1');
	}
	
	function select() {
		$this->Area->recursive = -1;
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
	}

}
?>