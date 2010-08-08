<?php
class AssignmentsController extends AppController {

	var $name = 'Assignments';
	var $helpers = array('schedule');

	function assign($shift_id, $person_id = null) {
		if ($person_id) {
			$this->Assignment->create();
			$this->data = array('Assignment' => array(
				'shift_id'  => $shift_id,
				'person_id' => $person_id
			));
			$this->record();
			$this->Assignment->sSave($this->data);
			$this->stop($this->Assignment->description);
			$this->redirect($this->referer());
		}
		$this->loadModel('Person');
		$this->loadModel('Shift');
		$this->set('people',$this->Assignment->Person->getAvailable($shift_id));
		$this->set('shift',$shift_id);	
	}		
	
	function unassign($id) {
		$this->record();
		$this->Assignment->sDelete($id);
		$this->stop($this->Assignment->description);
		$this->redirect($this->referer());
	}

	function swap($assignment_id, $person_id) {
		$assignment =$this->Assignment->sFind('first',array(
			'conditions' => array('Assignment.id' => $assignment_id),
			'recursive' => -1
		));
		$assignment['Assignment']['person_id'] = $person_id;
		$assignment['Assignment']['name'] = '';
		$this->record();
		$this->Assignment->sSave($assignment);
		$this->stop($this->Assignment->description);
		$this->redirect($this->referer());
	}
}
?>
