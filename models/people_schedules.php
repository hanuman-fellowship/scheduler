<?php
class PeopleSchedules extends AppModel {

	var $name = 'PeopleSchedules';

	var $restore = false;
	var $belongsTo = array(
		'ResidentCategory',
		'Person'
	);

	function sSave($data) {
		if (isset($data['PeopleSchedules']['id'])) {
			$name = $this->Person->getNameFromPeopleSchedulesId($data['PeopleSchedules']['id']);
		}
		if (isset($data['PeopleSchedules']['notes'])) {
			$data['PeopleSchedules']['notes'] = trim($data['PeopleSchedules']['notes']);
			$description = "{$name}'s notes changed: {$data['PeopleSchedules']['notes']}";
		}
		if (isset($data['PeopleSchedules']['resident_category_id']) &&
		isset($data['PeopleSchedules']['id'])) {
			$category = $this->ResidentCategory->sFind('first',array(
				'recursive' => -1,
				'conditions' => array(
					'ResidentCategory.id' => $data['PeopleSchedules']['resident_category_id']
				)
			));
			$description = "{$name}'s category changed to {$category['ResidentCategory']['name']}";
		}
		parent::sSave($data);
		return isset($description) ? $description : '';
	}

}
