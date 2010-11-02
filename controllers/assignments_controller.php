<?php
class AssignmentsController extends AppController {

	var $name = 'Assignments';
	var $helpers = array('schedule');

	function assign($shift_id = null, $person_id = null) {
		if ($shift_id < 0) { // if it's a request form
			$this->redirect(array('controller'=>'RequestAssignments','action'=>'assign',$shift_id,$person_id));
		}
		$this->redirectIfNotEditable();
		if ($this->data) {
			$shift_id = $this->data['Assignment']['shift'];
			$person_id = 0;
			$name = $this->data['Assignment']['other'];
		}
		if (!is_null($person_id)) {
			$this->Assignment->create();
			$this->data = array('Assignment' => array(
				'shift_id'  => $shift_id,
				'person_id' => $person_id,
				'name' => isset($name) ? $name : ''
			));
			$this->record();
			$changes = $this->Assignment->sSave($this->data);
			$this->stop($this->Assignment->description($changes));
			$this->redirect($this->referer());
		}
		$this->loadModel('Person');
		$this->loadModel('Shift');
		$this->set('people',$this->Assignment->Person->getAvailable($shift_id));
		$this->set('shift',$shift_id);	
	}		
	
	function unassign($id) {
		if ($id < 0) { // if it's a request form
			$this->redirect(array('controller'=>'RequestAssignments','action'=>'unassign',$id));
		}
		$this->redirectIfNotEditable();
		$this->record();
		$changes = $this->Assignment->sDelete($id);
		$this->stop($this->Assignment->description($changes));
		$this->redirect($this->referer());
	}

	function swap($assignment_id, $person_id) {
		$this->redirectIfNotEditable();
		$assignment =$this->Assignment->sFind('first',array(
			'conditions' => array('Assignment.id' => $assignment_id),
			'recursive' => -1
		));
		$assignment['Assignment']['person_id'] = $person_id;
		$assignment['Assignment']['name'] = '';
		$this->record();
		$changes = $this->Assignment->sSave($assignment);
		$this->stop($this->Assignment->description($changes));
		$this->redirect($this->referer());
	}
}
?>
