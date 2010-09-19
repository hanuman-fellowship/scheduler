<?php
class PeopleSchedules extends AppModel {

	var $name = 'PeopleSchedules';

	var $restore = false;
	var $belongsTo = array(
		'ResidentCategory',
		'Person'
	);

	function sSave($data) {
		$changes = parent::sSave($data);
		$this->setDescription($changes);
	}

	function sDelete($data) {
		$changes = parent::sDelete($data);
		$this->setDescription($changes);
	}

	function setDescription($changes) {
		if (isset($changes['newData'])) {
			$person = $this->Person->getPerson($changes['newData']['person_id'],true);
			if ($changes['oldData']['id'] == '') {
				$this->description = $this->restore ? 
					"Person restored: {$person['Person']['first']}" :
					"New person created: {$person['Person']['first']}";
			} else {
				$this->description = 'Person changed: '.
				"{$person['Person']['first']}";
				$listed = false;
				foreach($changes['newData'] as $field => $val) {
					if ($changes['newData'][$field] != $changes['oldData'][$field]) {
						$this->description .= $listed ? ', ' : ' ';
						$this->description .= 
							Inflector::humanize($field).':'.$val;
						$listed = true;
					}
				}
			}
		} else {
			$person = $this->Person->getPerson($changes['person_id'],true);
			$this->description = "Person retired: {$person['Person']['first']}";
		}
	}
	
	
}
