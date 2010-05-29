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
				$this->Session->setFlash(__('The User could not be saved. Please, try again.', true));
			}
		}
		$areas = $this->Shift->Area->sFind('list');
		$this->set(compact('groups'));
}		
	
	
}
?>