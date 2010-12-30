<?php
class FloatingShift extends AppModel {

	var $name = 'FloatingShift';

	var $belongsTo = array(
		'Person',
		'Area'
	);

	function valid($data) {
		$hours = $data['FloatingShift']['hours'];
		if (!is_numeric($hours) || $hours <= 0) {
			$this->errorField = 'hours';
			$this->errorMessage = "Invalid # of hours";
			return false;
		}
		return true;
	}

	function description($changes) {
		if (isset($changes['newData'])) {	
			$newData = $this->format($changes['newData']);
			if ($changes['oldData']['id'] == '') {
				$desc = "New floating shift: {$newData['name']}";
			} else {
				$oldData = $this->format($changes['oldData']);				
				$desc = 'Floating shift changed: '.
				"{$oldData['name']}";
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
			$oldData = $this->format($changes);
			$desc = "Floating shift deleted: {$oldData['name']}";
		}
		return $desc;
	}

	function format($data) {
		$area = $this->Area->sFind('first',array(
			'conditions' => array('Area.id' => $data['area_id']),
			'recursive' => -1
		));
		$data['area_id'] = $area['Area']['short_name'];
		$person = $this->Person->find('first',array(
			'conditions' => array('Person.id' => $data['person_id']),
			'recursive' => -1
		));
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
