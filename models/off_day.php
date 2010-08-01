<?php
class OffDay extends AppModel {

	var $name = 'OffDay';

	var $belongsTo = array(
		'Person'
	);

	function sSave($data) {
		$changes = parent::sSave($data);
		$this->setDescription($changes);
		$this->Person->Assignment->schedule_id = $this->schedule_id;
		$this->sContain('Person.Assignment.Shift');
		$offDay = $this->sFind('first');
		foreach($offDay['Person']['Assignment'] as $assignment) {
			if ($assignment['Shift']['day_id'] == $offDay['OffDay']['day_id']) {
				$this->Person->Assignment->sDelete($assignment['id']);
			}
		}
	}

	function setDescription($changes) {
		if (isset($changes['newData'])) {
			$person = $this->Person->getPerson($changes['newData']['person_id'],true);
			if ($changes['oldData']['id'] == '') {
				$this->description = "{$person['Person']['name']} now off {$day}";
			}
		} else {
			$person = $this->Person->getPerson($changes['person_id'],true);
			$this->description = "{$person['Person']['name']} no longer off {$day}";
		}
	}
}
?>
