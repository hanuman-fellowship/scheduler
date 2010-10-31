<?php
class FloatingShift extends AppModel {

	var $name = 'FloatingShift';

	var $belongsTo = array(
		'Person',
		'Area'
	);

	function valid($data) {
		$hours = $data['FloatingShift']['hours'];
		if (!is_numeric($hours) || $hours < 1) {
			$this->errorField = 'hours';
			$this->errorMessage = "Invalid # of hours";
			return false;
		}
		return true;
	}

	function sSave($data) {
		$changes = parent::sSave($data);
		$this->setDescription($changes);
	}
	
	function sDelete($id) {
		$changes = parent::sDelete($id);
		if (isset($changes)) { // if $id is array (this is a dependant of a higher delete like 'retire')
			$this->setDescription($changes);
		}
	}
	
	function setDescription($changes) {
		if (isset($changes['newData'])) {	
			$newData = $this->format($changes['newData']);
			if ($changes['oldData']['id'] == '') {
				$this->description = "New floating shift: {$newData['name']}";
			} else {
				$oldData = $this->format($changes['oldData']);				
				$this->description = 'Floating shift changed: '.
				"{$oldData['name']}";
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
			$oldData = $this->format($changes);
			$this->description = "Floating shift deleted: {$oldData['name']}";
		}
	}

	function format($data) {
		$this->Area->id = $data['area_id'];
		$this->Area->recursive = -1;
		$this->Area->schedule_id = $this->schedule_id;
		$area = $this->Area->sFind('first');
		$data['area_id'] = $area['Area']['short_name'];
		$this->Person->id = $data['person_id'];
		$this->Person->recursive = -1;
		$person = $this->Person->find('first');
		$data['person_id'] = $person['Person']['first'];
		$data['name'] = 
			$data['area_id'].'; '.
			$data['hours'];
		$data['name'] .=
			($data['hours'] == 1) ? ' hr ' : ' hrs ';
		$data['name'] .= 
			' w/ '.$data['person_id'];
		$data['name'] .= ($data['note'] != '') ? ' ('.$data['note'].')' : '';
		return $data;
	}
}
?>
