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
				$changes = $this->Area->sSave($this->data);
				$this->stop($this->Area->description($changes));
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
				$changes = $this->Area->sSave($this->data);
				$this->stop($this->Area->description($changes));
				$this->set('url', array('controller' => 'areas', 'action' => 'schedule', $this->data['Area']['id']));
			 } else {
				$this->set('errorField',$this->Area->errorField);
				$this->set('errorMessage',$this->Area->errorMessage);
			}
		} else {
			$this->id = $id;
			$this->data = $this->Area->sFind('first');
		}
	}
	
	function editNotes($id = null) {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			$this->record();
			$changes = $this->Area->sSave($this->data);
			$this->stop($this->Area->description($changes));
			$this->set('url',$this->referer());
		} else {
			$this->id = $id;
			$this->data = $this->Area->sFind('first');
		}
	}

	function delete($id = null) {
		$this->redirectIfNotEditable();
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
		if (!empty($this->data)) {
			$this->set('area_id',$this->data['Area']['area_id']);
			$this->set('url', $this->referer());
			if ($this->data['Area']['area_id']) {
				$this->record();
				$changes = $this->Area->sDelete($this->data['Area']['area_id']);
				$this->stop($this->Area->description($changes));
			}
		} else {
			$this->data['Area']['area_id'] = array($id);
		}
	}
	
	function clear($id = null) {
		$this->redirectIfNotEditable();
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
		if (!empty($this->data) ) {
			$this->set('area_id',$this->data['Area']['area_id']);
			$this->set('url', $this->referer());
			if ($this->data['Area']['area_id']) {
				$this->record();
				$changes = $this->Area->clear(
					$this->data['Area']['area_id'],$this->data['Area']['keep_shifts']);
				$this->stop($this->Area->description($changes));
			}
		} else {
			$this->data['Area']['area_id'] = array($id);
		}
	}

	function select() {
		$this->Area->recursive = -1;
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
	}

}
?>
