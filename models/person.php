<?php
class Person extends AppModel {

	var $name = 'Person';

	var $belongsTo = array(
		'ResidentCategory'
	);

	var $hasMany = array(
		'Assignment',
		'FloatingShift',
		'OffDay'
	);

	function sSave($data) {
		$changes = parent::sSave($data);
		$this->setDescription($changes);
	}
	
	function sDelete($id) {
		$this->id = $id;
		$this->Assignment->schedule_id = $this->schedule_id;
		$this->sContain('Assignment');
		$person = $this->sFind('first');
		foreach($person['Assignment'] as $assignment) {
			$this->Assignment->sDelete($assignment['id']);
		}
		$changes = parent::sDelete($id);
		$this->setDescription($changes);
	}
	
	function setDescription($changes) {
		if (isset($changes['newData'])) {
			if ($changes['oldData']['id'] == '') {
				$this->description = "New person created: {$changes['newData']['name']}";
			} else {
				$this->description = 'Person changed: '.
				"{$changes['oldData']['name']}";
				$listed = false;
				foreach($changes['newData'] as $field => $val) {
					if ($changes['newData'][$field] != $changes['oldData'][$field]) {
						$this->description .= $listed ? ', ' : ' ';
						$this->description .= 
							Inflector::humanize($field).' is now '.$val;
						$listed = true;
					}
				}
			}
		} else {
			$this->description = "Person deleted: {$changes['name']}";
		}
	}
	
	
	function getPerson($id) {
		$this->id = $id;
		$this->sContain('Assignment.Shift.Area','ResidentCategory','OffDay','FloatingShift.Area');
		$person = $this->sFind('first');
		return $person;
	}	

	function available($shift_id) {
		$this->Assignment->Shift->id = $shift_id;
		$this->Assignment->Shift->recursive = -1;
		$shift = $this->Assignment->Shift->sFind('first');
		$this->sContain('OffDay','Assignment.Shift','ResidentCategory');
		$this->order = array('Person.resident_category_id','Person.name');
		$people = $this->sFind('all');
		$list = array();
		foreach($people as $person_num => $person) {
			$list[$person_num] = $person['Person'];
			$list[$person_num]['ResidentCategory'] = $person['ResidentCategory'];
			$list[$person_num]['available'] = true; // benefit of the doubt
			foreach($person['OffDay'] as $OffDay) {
				
				if ($shift['Shift']['day_id'] == $OffDay['day']) {
					$list[$person_num]['available'] = false; // it's their off day
					continue;
				}
			}
			foreach($person['Assignment'] as $assignment) {
				$a = $shift['Shift'];
				$b = $assignment['Shift'];
				if ($a['id'] == $b['id']) {
					$list[$person_num]['available'] = false; // they are already on that shift
					continue;
				}
				if (
					($a['day_id'] == $b['day_id']) && ( // the shifts are on the same day AND
						($a['start'] >= $b['start'] && $a['start'] <= $b['end']) || // a starts during b or
						($b['start'] >= $a['start'] && $b['start'] <= $a['end'])    // b starts during a
					)
				) {
					$list[$person_num]['available'] = false; // they have are on a conflicting shift
					continue;
				}
			}
		}
		return $list;
	}

}
?>
