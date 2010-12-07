<?php
class OperationsNote extends AppModel {

	var $name = 'OperationsNote';
	var $belongsTo = array(
		'Person'
	);

	function getList($id) {
		$this->contain('Person');
		$notes = $this->find('all');
		$this->Person->addDisplayNamesAll($notes);
		return Set::combine($notes,'{n}.OperationsNote.id','{n}.Person.name');
	}

	function save($data) {
		if (isset($data['OperationsNote']['note'])) {
			if (trim($data['OperationsNote']['note']) == '') {
				if (isset($data['OperationsNote']['id']))
					$this->delete($data['OperationsNote']['id']);
				return;
			}
		}
		if (!isset($data['OperationsNote']['order'])) {
			$data['OperationsNote']['order'] = $this->field('order',array(
				'person_id' => $data['OperationsNote']['person_id']
			),'order desc') + 1;
		}
		parent::save($data);
	}

}
