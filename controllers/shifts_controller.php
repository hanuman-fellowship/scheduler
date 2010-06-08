<?php
class ShiftsController extends AppController {

	var $name = 'Shifts';

	function add($area_id = null) {
		if (!empty($this->data)) {
			$this->Shift->create();
			$this->record();
			if ($this->Shift->sSave($this->data)) {
				$area_name = $this->Shift->Area->field('name', array('id' => $this->data['Shift']['area_id']));
				$this->stop("New {$area_name} shift created");
				$this->redirect(array('controller' => 'areas', 'action' => 'schedule', $this->data['Shift']['area_id']));
			} else {
				$this->Session->setFlash(__('The Area could not be saved. Please, try again.', true));
			}
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
			if ($this->Shift->sSave($this->data)) {
				$this->stop("Shift edited");
				$this->redirect(array('controller' => 'areas', 'action' => 'schedule', $this->data['Shift']['area_id']));
			} else {
				$this->Session->setFlash(__('The Shift could not be saved. Please, try again.', true));
			}
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
		$this->stop("Shift Deleted");
		$this->redirect('/areas/schedule/1');
	}
	
}
?>