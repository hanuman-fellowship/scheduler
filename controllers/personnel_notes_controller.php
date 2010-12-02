<?php
class PersonnelNotesController extends AppController {

	var $name = 'PersonnelNotes';
	
	function edit($id = null) {
		$this->redirectIfNot('personnel');
		if (!empty($this->data)) {
			$this->PersonnelNote->save($this->data);
			$this->set('url',$this->referer());
			$id = $this->data['PersonnelNote']['person_id'];
		}
		if (!$id) {
			$this->set('people',$this->PersonnelNote->Person->listByResidentCategory());
			$this->render('select');
		} else {
			$this->data = $this->PersonnelNote->makeOrGet($id);
			$this->PersonnelNote->Person->addDisplayName($this->data['Person']);
		}
	}

}
?>
