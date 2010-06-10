<?php
class Assignment extends AppModel {

	var $name = 'Assignment';

	var $belongsTo = array(
		'Person',
		'Shift'
	);
	
	function sSave($data) {
		$changes = parent::sSave($data);
		$this->setDescription($changes);
	}
	
	function sDelete($id) {
		$changes = parent::sDelete($id);
		$this->setDescription($changes);
	}	

	function setDescription($changes) {
		$this->Shift->schedule_id = $this->schedule_id;
		if (isset($changes['newData'])) {
			$data = $changes['newData'];
			$assignedOrRemoved = 'assigned to';
			$this->sContain('Person','Shift');
			$this->id = $data['id'];
			$shift = $this->sFind('first');
			$person = $shift['Person'];
		} else {
			$data = $changes;
			$assignedOrRemoved = 'removed from';
			$this->Shift->id = $data['shift_id'];
			$shift = $this->Shift->sFind('first');
			$this->Person->schedule_id = $this->schedule_id;
			$this->Person->id = $data['person_id'];
			$this->Person->recursive = -1;
			$person = $this->Person->sFind('first');
			$person = $person['Person'];
		}
		$formatted = $this->Shift->formatShift($shift['Shift']);		
		$this->description = "{$person['name']} {$assignedOrRemoved} {$formatted['name']}";
	}
	
}
?>