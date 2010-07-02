<?php
class AreasController extends AppController {

	var $name = 'Areas';
	var $helpers = array('schedule');

	function schedule($id = null) {
		if ($id) {
			$this->set('area',$this->Area->getArea($id));
			$this->loadModel('Boundary');
			$this->set('bounds', $this->Boundary->getBounds());
			if ($this->params['isAjax']) $this->render('/elements/schedule_content');
		} else {
			$this->redirect(array('action'=>'select'));
		}
	}
	
	function add($area_id = null) {
		if (!empty($this->data)) {
			if ($this->Area->valid($this->data)) {
				$this->Area->create();
				$this->record();
				$this->Area->sSave($this->data);
				$this->stop($this->Area->description);
				$this->set('url', array('controller' => 'areas', 'action' => 'schedule', $this->Area->id));
			} else {
				$this->set('errorField',$this->Area->errorField);
				$this->set('errorMessage',$this->Area->errorMessage);
			}
		}
	}
	
	function edit($id = null) {
		if (!empty($this->data)) {
			if ($this->Area->valid($this->data)) {
				$this->record();
				$this->Area->sSave($this->data);
				$this->stop($this->Area->description);
				$this->set('url', array('controller' => 'areas', 'action' => 'schedule', $this->data['Area']['id']));
			 } else {
				$this->set('errorField',$this->Area->errorField);
				$this->set('errorMessage',$this->Area->errorMessage);
			}
		}
		if (empty($this->data)) {
			$this->id = $id;
			$this->data = $this->Area->sFind('first');
		}
	}
	
	function delete($id = null) {
		if ($id) {
			$this->record();
			$this->Area->sDelete($id);
			$this->stop($this->Area->description);
			$this->redirect('/');
		}
		$this->Area->recursive = -1;
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
	}
	
	function select() {
		$this->Area->recursive = -1;
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
	}

}
?>
