<?php
class OffDay extends AppModel {

	var $name = 'OffDay';

	var $belongsTo = array(
		'Person'
	);

	function sSave($data) {
		$changes = parent::sSave($data);
		$this->sContain('Person.Assignment.Shift');
		$offDay = $this->sFind('first');
		foreach($offDay['Person']['Assignment'] as $assignment) {
			if ($assignment['Shift']['day_id'] == $offDay['OffDay']['day_id']) {
				$this->Person->Assignment->sDelete($assignment['id']);
			}
		}
		return $changes;
	}

	function description($changes) {
		if (isset($changes['newData'])) {
			$personName = $this->Person->getName($changes['newData']['person_id']);
			$day = $this->Person->Assignment->Shift->Day->getShortName($changes['newData']['day_id']);
			if ($changes['oldData']['id'] == '') {
				$desc = "{$personName} now has {$day} off";
			}
		} else {
			$personName = $this->Person->getName($changes['person_id']);
			$day = $this->Person->Assignment->Shift->Day->getShortName($changes['day_id']);
			$desc = "{$personName} no longer has {$day} off";
		}
		return $desc;
	}
}
?>
