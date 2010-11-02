<?php
class PeopleSchedules extends AppModel {

	var $name = 'PeopleSchedules';

	var $restore = false;
	var $belongsTo = array(
		'ResidentCategory',
		'Person'
	);

	function description($changes) {
		if (isset($changes['newData'])) {
			$person = $this->Person->getPerson($changes['newData']['person_id'],true);
			if ($changes['oldData']['id'] == '') {
				$desc = $this->restore ? 
					"Person restored: {$person['Person']['first']}" :
					"New person created: {$person['Person']['first']}";
			} else {
				$desc = 'Person changed: '.
				"{$person['Person']['first']}";
				$listed = false;
				foreach($changes['newData'] as $field => $val) {
					if ($changes['newData'][$field] != $changes['oldData'][$field]) {
						$desc .= $listed ? ', ' : ' ';
						$desc .= 
							Inflector::humanize($field).':'.$val;
						$listed = true;
					}
				}
			}
		} else {
			$person = $this->Person->getPerson($changes['person_id'],true);
			$desc = "Person retired: {$person['Person']['first']}";
		}
		return $desc;
	}
	
	
}
