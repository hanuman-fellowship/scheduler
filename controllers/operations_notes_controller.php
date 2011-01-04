<?php
class OperationsNotesController extends AppController {

	var $name = 'OperationsNotes';
	
	function edit($id = null) {
		$this->redirectIfNot('operations');
		if (!empty($this->data)) {
			$this->OperationsNote->save($this->data);
			$this->set('url',$this->referer());
			$id = $this->data['OperationsNote']['id'];
		}
		if (!$id) {
			$this->redirect('/');
		} else {
			$this->data = $this->OperationsNote->findById($id);
		}
	}

	function add($person_id = null) {
		$this->redirectIfNot('operations');
		if (!empty($this->data)) {
			$this->OperationsNote->create();
			$this->OperationsNote->save($this->data);
			$this->set('url',$this->referer());
			$person_id = $this->data['OperationsNote']['person_id'];
		}
		if (!$person_id) {
			$this->set('people',$this->OperationsNote->Person->listByResidentCategory());
			$this->render('select');
		} else {
			$this->data = array('OperationsNote'=>array('person_id'=>$person_id));
		}
	}

	function reorder() {
		debug($this->data);
		$order = explode(',',$this->data['OperationsNote']['lonotes_order']);
		foreach($order as $num => $id) {
			$this->OperationsNote->save(array(
				'OperationsNote' => array(
					'id' => $id,
					'order' => $num
				)
			));
		}
	}

}
?>
