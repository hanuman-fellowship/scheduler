<?php
class RequestAssignmentsController extends AppController {

	var $name = 'RequestAssignments';

	function assign($shift_id = null, $person_id = null) {
		if ($this->data) {
			$shift_id = $this->data['RequestAssignment']['shift'];
			$person_id = 0;
			$name = $this->data['RequestAssignment']['other'];
		}
		if (!is_null($person_id)) {
			$this->RequestAssignment->create();
			$this->data = array('RequestAssignment' => array(
				'request_shift_id'  => $shift_id,
				'person_id' => $person_id,
				'name' => isset($name) ? $name : ''
			));
			$this->RequestAssignment->save($this->data);
			$this->redirect($this->referer());
		}
		$this->loadModel('Person');
		$this->loadModel('Shift');
		$this->set('people',$this->Person->getAvailable($shift_id));
		$this->set('shift',$shift_id);	
	}		
	
	function unassign($id) {
		$this->RequestAssignment->delete($id);
		$this->redirect($this->referer());
	}

}
?>
