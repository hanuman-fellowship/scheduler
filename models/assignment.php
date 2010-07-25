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
		$this->Person->schedule_id = $this->schedule_id;
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
				$this->Person->addDisplayName($oldPerson['Person']);
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
		$this->Person->addDisplayName($person);
		$this->description = "{$person['name']} {$assignedOrRemoved} {$formatted['name']}";
	}
	
}
?>
