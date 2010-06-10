<?php
class ShiftsController extends AppController {

	var $name = 'Shifts';

	function add($area_id = null) {
		if (!empty($this->data)) {
			$this->Shift->create();
			$this->record();
			$this->Shift->sSave($this->data);
			$this->stop($this->Shift->description);
			$this->redirect(array('controller' => 'areas', 'action' => 'schedule', $this->data['Shift']['area_id']));
		}
		$this->loadModel('Area');
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
		$this->set('area_id',$area_id);
		$this->loadModel('Day');
		$this->Day->order = 'id';
		$this->set('days',$this->Day->sFind('list'));
	}
	
	function edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid Shift', true));
			$this->redirect(array('action' => 'index'));
		}
		if (!empty($this->data)) {
			$this->record();
			$this->Shift->sSave($this->data);
			$this->stop($this->Shift->description);
			$this->redirect(array('controller' => 'areas', 'action' => 'schedule', $this->data['Shift']['area_id']));
		}
		if (empty($this->data)) {
			$this->id = $id;
			$this->data = $this->Shift->sFind('first');
		}
		$this->loadModel('Area');
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
		$this->loadModel('Day');
		$this->Day->order = 'id';
		$this->set('days',$this->Day->sFind('list'));
	}
	
	function delete($id) {
		$this->record();
		$this->Shift->sDelete($id);
		$this->stop($this->Shift->description);
		$this->redirect('/areas/schedule/1');
	}
	
}
?>