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
		return parent::sSave($data);
	}
	
	function sDelete($id) {
		$this->id = $id;
		return parent::sDelete($id);
	}
	
	function description($changes) {
		if (isset($changes['newData'])) {
			$newData = $this->format($changes['newData']);
			if ($changes['oldData']['id'] == '') {
				$desc = "New Constant Shift: {$newData['details']}";
			} else {
				$oldData = $this->format($changes['oldData']);				
				$desc = "Constant Shift changed: ({$oldData['name']})";
				$listed = false;
				foreach($changes['newData'] as $field => $val) {
					if ($changes['newData'][$field] != $changes['oldData'][$field]) {
						switch ($field) {
							case 'name':
								$desc .= $listed ? ', ' : ' ';
								$desc .= 
									'name:'.$newData['name'];
								break;
							case 'resident_category_id':
								$desc .= $listed ? ', ' : ' ';
								$desc .= 
									'category:'.$newData['resident_category_id'];
								break;
							case 'day_id':
								$desc .= $listed ? ', ' : ' ';
								$desc .= 
									'day:'.$newData['day_id'];
								break;		
							case 'start':
								$desc .= $listed ? ', ' : ' ';
								$desc .= 
									'start:'.$newData['start'];
								break;		
							case 'end':
								$desc .= $listed ? ', ' : ' ';
								$desc .= 
									'end:'.$newData['end'];
								break;		
							case 'specify_hours':
								$desc .= $listed ? ', ' : ' ';
								$desc .= 'specify hours:';
								$desc .= $newData['specify_hours'] ? 'yes' : 'no';
								break;	
							case 'hours':
								$desc .= $listed ? ', ' : ' ';
								$desc .= 
									'hours:'.$newData['hours'];
								break;	
						}
						$listed = true;
					}
				}
			}
		} else {
			$oldData = $this->format($changes);
			$desc = "Constant Shift deleted: {$oldData['details']}";
		}
		return $desc;
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
