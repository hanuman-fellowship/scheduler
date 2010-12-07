<?php
class PersonnelNote extends AppModel {

	var $name = 'PersonnelNote';
	var $belongsTo = array(
		'Person'
	);

	function getList($id) {
		$this->contain('Person');
		$notes = $this->find('all');
		$this->Person->addDisplayNamesAll($notes);
		return Set::combine($notes,'{n}.PersonnelNote.id','{n}.Person.name');
	}

	function save($data) {
		if (isset($data['PersonnelNote']['note'])) {
			if (trim($data['PersonnelNote']['note']) == '') {
				if (isset($data['PersonnelNote']['id']))
					$this->delete($data['PersonnelNote']['id']);
				return;
			}
		}
		if (!isset($data['PersonnelNote']['order'])) {
			$data['PersonnelNote']['order'] = $this->field('order',array(
				'person_id' => $data['PersonnelNote']['person_id']
			),'order desc') + 1;
		}
		parent::save($data);
	}

}
