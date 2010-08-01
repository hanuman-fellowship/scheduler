<?php
class ConstantShift extends AppModel {

	var $name = 'ConstantShift';

	var $belongsTo = array(
		'ResidentCategory',
		'Day'
	);

	function valid($data) {
		foreach($data['ConstantShift'] as $key=>$val) {
			$$key=$val;
		}
		$start = $this->dbTime($start);
		$end = $this->dbTime($end);
		if (!$name) {
			$this->errorField = 'name';
			$this->errorMessage = "Name must not be blank";
			return false;
		}
		if ($end <= $start) {	
			$this->errorField = 'start';
			$this->errorMessage = "Start must be before end";
			return false;
		}
		if(!is_numeric($hours) && $hours != '') {
			$this->errorField = 'hours';
			$this->errorMessage = "Hours must be a number";
			return false;
		}
		return true;
	}

	function sSave($data) {
		$times = array('start', 'end');
		foreach($times as $time) {
			$data['ConstantShift'][$time] = $this->dbTime($data['ConstantShift'][$time]);
		}
		$changes = parent::sSave($data);
		$this->setDescription($changes);
	}
	
	function setDescription($changes) {
		if (isset($changes['newData'])) {
			$newData = $this->format($changes['newData']);
			if ($changes['oldData']['id'] == '') {
				$this->description = "New Constant Shift: {$newData['details']}";
			} else {
				$oldData = $this->format($changes['oldData']);				
				$this->description = "Constant Shift changed: ({$oldData['name']})";
				$listed = false;
				foreach($changes['newData'] as $field => $val) {
					if ($changes['newData'][$field] != $changes['oldData'][$field]) {
						switch ($field) {
							case 'name':
								$this->description .= $listed ? ', ' : ' ';
								$this->description .= 
									'name -> '.$newData['name'];
								break;
							case 'resident_category_id':
								$this->description .= $listed ? ', ' : ' ';
								$this->description .= 
									'category -> '.$newData['resident_category_id'];
								break;
							case 'day_id':
								$this->description .= $listed ? ', ' : ' ';
								$this->description .= 
									'day -> '.$newData['day_id'];
								break;		
							case 'start':
								$this->description .= $listed ? ', ' : ' ';
								$this->description .= 
									'start -> '.$newData['start'];
								break;		
							case 'end':
								$this->description .= $listed ? ', ' : ' ';
								$this->description .= 
									'end -> '.$newData['end'];
								break;		
							case 'hours':
								$this->description .= $listed ? ', ' : ' ';
								$this->description .= 
									'hours -> '.$newData['hours'];
								break;	
						}
						$listed = true;
					}
				}
			}
		} else {
			$oldData = $this->format($changes);
			$this->description = "Constant Shift deleted: {$oldData['name']}";
		}
	}
	
	function format($data) {
		$this->ResidentCategory->id = $data['resident_category_id'];
		$this->ResidentCategory->recursive = -1;
		$this->ResidentCategory->schedule_id = $this->schedule_id;
		$resodent_category = $this->ResidentCategory->sFind('first');
		$data['resident_category_id'] = $resodent_category['ResidentCategory']['name'];
		$this->Day->id = $data['day_id'];
		$this->Day->recursive = -1;
		$this->Day->schedule_id = $this->schedule_id;
		$day = $this->Day->sFind('first');
		$data['day_id'] = substr($day['Day']['name'],0,3);
		$start = strtotime($data['start']);
		$minutes = (date('i',$start) == '00') ? '' : ':i';
		$data['start'] = date("g{$minutes}",$start);
		$end = strtotime($data['end']);
		$minutes = (date('i',$end) == '00') ? '' : ':i';
		$data['end'] = date("g{$minutes}",$end);
		$data['details'] = 
			$data['name'].' '.
			$data['resident_category_id'].' '.
			$data['day_id'].' '.
			$data['start'].' - '.
			$data['end'];
		return $data;
	}

}
?>
