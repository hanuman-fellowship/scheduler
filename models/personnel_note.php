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

	function makeOrGet($id) {
		if (!$this->findByPersonId($id)) {
			$this->create();
			$this->save(array(
				'PersonnelNote' => array(
					'person_id' => $id
				)
			));
		}
		return $this->findByPersonId($id);
	}

}
