<?php
class ConstantShiftsController extends AppController {

	var $name = 'ConstantShifts';

	function add() {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->ConstantShift->valid($this->data)) {
				$this->ConstantShift->create();
				$this->record();
				$changes = $this->ConstantShift->sSave($this->data);
				$this->stop($this->ConstantShift->description($changes));
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->ConstantShift->errorField);
				$this->set('errorMessage',$this->ConstantShift->errorMessage);
				$start = $this->data['ConstantShift']['start'];
				$end = $this->data['ConstantShift']['end'];
			}
		}
		$start = isset($start) ? $start : '13:00:00';
		$end = isset($end) ? $end : date("H:i:s",strtotime($start." + 1 hour"));
		$this->set('start',$start);
		$this->set('end',$end);
		$this->loadModel('ResidentCategory');
		$this->ResidentCategory->order = 'id';
		$this->set('residentCategories',$this->ResidentCategory->sFind('list'));
		$this->loadModel('Day');
		$this->Day->order = 'id';
		$this->set('days',$this->Day->sFind('list',array(
			'conditions' => array(
				'Day.name <>' => ''
			)
		)));
	}

	function edit($id = null) {
		$this->redirectIfNotEditable();
		if (!$id && empty($this->data)) {
			$this->redirect(array('action' => 'index'));
		}
		if (!empty($this->data)) {
			if ($this->ConstantShift->valid($this->data)) {
				$this->record();
				$changes = $this->ConstantShift->sSave($this->data);
				$this->stop($this->ConstantShift->description($changes));
				$this->set('url',$this->referer());
			} else {
				$this->set('errorField',$this->ConstantShift->errorField);
				$this->set('errorMessage',$this->ConstantShift->errorMessage);
			}
		}
		if (empty($this->data)) {
			$this->id = $id;
			$this->data = $this->ConstantShift->sFind('first');
		}
		$this->loadModel('ResidentCategory');
		$this->ResidentCategory->order = 'id';
		$this->set('residentCategories',$this->ResidentCategory->sFind('list'));
		$this->loadModel('Day');
		$this->Day->order = 'id';
		$this->set('days',$this->Day->sFind('list',array(
			'conditions' => array(
				'Day.name <>' => ''
			)
		)));
	}
	
	function delete($id) {
		$this->redirectIfNotEditable();
		$this->record();
		$changes = $this->ConstantShift->sDelete($id);
		$this->stop($this->ConstantShift->description($changes));
		$this->redirect($this->referer());
	}
		
}
?>
