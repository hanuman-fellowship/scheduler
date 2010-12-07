<?php
class PersonnelNotesController extends AppController {

	var $name = 'PersonnelNotes';
	
	function edit($id = null) {
		$this->redirectIfNot('personnel');
		if (!empty($this->data)) {
			$this->PersonnelNote->save($this->data);
			$this->set('url',$this->referer());
			$id = $this->data['PersonnelNote']['id'];
		}
		if (!$id) {
			$this->redirect('/');
		} else {
			$this->data = $this->PersonnelNote->findById($id);
		}
	}

	function add($person_id = null) {
		$this->redirectIfNot('personnel');
		if (!empty($this->data)) {
			$this->PersonnelNote->create();
			$this->PersonnelNote->save($this->data);
			$this->set('url',$this->referer());
			$person_id = $this->data['PersonnelNote']['person_id'];
		}
		if (!$person_id) {
			$this->set('people',$this->PersonnelNote->Person->listByResidentCategory());
			$this->render('select');
		} else {
			$this->data = array('PersonnelNote'=>array('person_id'=>$person_id));
		}
	}

	function reorder() {
		debug($this->data);
		$order = explode(',',$this->data['PersonnelNote']['lpnotes_order']);
		foreach($order as $num => $id) {
			$this->PersonnelNote->save(array(
				'PersonnelNote' => array(
					'id' => $id,
					'order' => $num
				)
			));
		}
	}

}
?>
