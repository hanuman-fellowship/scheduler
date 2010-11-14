<?php
class Assignment extends AppModel {

	var $name = 'Assignment';

	var $belongsTo = array(
		'Person',
		'Shift'
	);
	
	function description($changes) {
		if (isset($changes['newData'])) {
			$data = $changes['newData'];
			$assignedOrRemoved = 'assigned to';
			$this->sContain('Person','Shift');
			$this->id = $data['id'];
			$shift = $this->sFind('first');
			$person = $shift['Person'];
			if ($changes['oldData']['id']) {
				$data = $changes['oldData'];
				$oldPerson = $this->Person->find('first',array(
					'conditions' => array('Person.id' => $data['person_id']),
					'recursive' => -1
				));
				if ($changes['oldData']['person_id'] != 0) {
					$this->Person->addDisplayName($oldPerson['Person']);
				} else {
					$oldPerson['Person']['name'] = $changes['oldData']['name'];
				}
				$assignedOrRemoved = "replaced {$oldPerson['Person']['name']} on";
			}
		} else {
			$data = $changes;
			$assignedOrRemoved = 'removed from';
			$this->Shift->id = $data['shift_id'];
			$shift = $this->Shift->sFind('first');
			$this->Person->recursive = -1;
			$person = $this->Person->find('first',array(
				'conditions' => array('Person.id' => $data['person_id'])
			));
			$person = $person['Person'];
		}
		$formatted = $this->Shift->format($shift['Shift']);		
		if ($data['person_id'] != 0 || $data != $changes) {
			$this->Person->addDisplayName($person);
		} else {
			$person['name'] = $data['name'];
		}
		$person['name'] = $person['name'] ? $person['name'] : $data['name'];
		return "{$person['name']} {$assignedOrRemoved} {$formatted['name']}";
	}
	
}
?>
