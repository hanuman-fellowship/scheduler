<?php
class ManagerNote extends AppModel {

	var $name = 'ManagerNote';
	var $belongsTo = array(
		'Area'
	);

	function save($data) {
		$existing = $this->findByAreaId($data['ManagerNote']['area_id']);
		if ($existing) {
			$this->id = $existing['ManagerNote']['id'];
			$data['ManagerNote']['id'] = $this->id;
		}
		parent::save($data);
	}

}
