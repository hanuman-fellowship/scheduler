<?php
class AreasController extends AppController {

	var $name = 'Areas';
	var $helpers = array('Schedule');

	function schedule($id = null) {
		if ($id) {
			$this->redirectIfNotValid($id);
			$this->set('area',$this->Area->getArea($id));
			$this->set('bounds', $this->getBounds());
			$this->set('change_messages',$this->getChangeMessages());
			$this->Session->write('last_area',$id);
		} else {
			$this->set('change_messages',$this->getChangeMessages());
			$this->set('area',0);
		}
	}
	
	function add($area_id = null) {
		$this->redirectIfNotEditable();
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
		$this->redirectIfNotEditable();
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
		$this->redirectIfNotEditable();
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
