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

	function sDelete($id) {
		$changes = parent::sDelete($id);
		$this->setDescription($changes);
	}
	
	function setDescription($changes) {
		$this->Person->Assignment->Shift->Day->schedule_id = $this->schedule_id;
		$this->Person->schedule_id = $this->schedule_id;
		if (isset($changes['newData'])) {
			$personName = $this->Person->getName($changes['newData']['person_id']);
			$day = $this->Person->Assignment->Shift->Day->getShortName($changes['newData']['day_id']);
			if ($changes['oldData']['id'] == '') {
				$this->description = "{$personName} now has {$day} off";
			}
		} else {
			$personName = $this->Person->getName($changes['person_id']);
			$day = $this->Person->Assignment->Shift->Day->getShortName($changes['day_id']);
			$this->description = "{$personName} no longer has {$day} off";
		}
	}
}
?>
