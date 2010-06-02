<?php
class AssignmentsController extends AppController {

	var $name = 'Assignments';
	var $helpers = array('schedule');

	function assign($shift_id, $person_id = null) {
		if ($person_id) {
			$this->Assignment->create();
			$this->record();
			$this->data = array('Assignment' => array(
				'shift_id'  => $shift_id,
				'person_id' => $person_id
			));
			if ($this->Assignment->sSave($this->data)) {
				$this->Assignment->info(); // get decsription and area_id
				$this->stop($this->Assignment->description);
				$this->redirect(array('controller' => 'areas', 'action' => 'schedule', $this->Assignment->area_id));
			} else {
				$this->Session->setFlash(__('The shift could not be assigned. Please, try again.', true));
			}
		}
		$this->loadModel('Person');
		$this->loadModel('Shift');
		$this->set('people',$this->Assignment->Person->available($shift_id));
		$this->set('shift',$shift_id);
	}		
}
?>