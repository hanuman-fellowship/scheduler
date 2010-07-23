<?php
class Shift extends AppModel {

	var $name = 'Shift';

	var $belongsTo = array(
		'Area',
		'Day'
	);
	
	var $hasMany = array(
		'Assignment'
	);
	
	function valid($data) {
		$start = $this->dbTime($data['Shift']['start']);
		$end = $this->dbTime($data['Shift']['end']);
		if ($end <= $start) {	
			$this->errorField = 'start';
			$this->errorMessage = "Start must be before end";
			return false;
		}
		$num_people = $data['Shift']['num_people'];
		if (!is_numeric($num_people) ||	$num_people < 1) {
			$this->errorField = 'num_people';
			$this->errorMessage = "Invalid # of people";
			return false;
		}	
		if (isset($data['Shift']['id'])) {
			$this->sContain('Assignment');
			$this->id = $data['Shift']['id'];
			$shift = $this->sFind('first');
			$num_assigned = count($shift['Assignment']);
			if ($num_people < $num_assigned) {
				$this->errorField = 'num_people';
				$this->errorMessage = "Too many people already assigned";
				return false;
			}
		}
		return true;
	}

	function sSave($data) {
		$times = array('start', 'end');
		foreach($times as $time) {
			$data['Shift'][$time] = $this->dbTime($data['Shift'][$time]);
		}
		$changes = parent::sSave($data);
		$this->setDescription($changes);
	}
	
	function sDelete($id) {
		$this->id = $id;
		$this->Assignment->schedule_id = $this->schedule_id;
		$this->sContain('Assignment');
		$shift = $this->sFind('first');
		foreach($shift['Assignment'] as $assignment) {
			$this->Assignment->sDelete($assignment['id']);
		}
		$changes = parent::sDelete($id);
		$this->setDescription($changes);
	}
	
	function setDescription($changes) {
		if (isset($changes['newData'])) {
			$newData = $this->format($changes['newData']);
			if ($changes['oldData']['id'] == '') {
				$this->description = "New Shift created: {$newData['name']}";
			} else {
				$oldData = $this->format($changes['oldData']);				
				$this->description = "Shift changed: ({$oldData['name']})";
				$listed = false;
				foreach($changes['newData'] as $field => $val) {
					if ($changes['newData'][$field] != $changes['oldData'][$field]) {
						switch ($field) {
							case 'area_id':
								$this->description .= $listed ? ', ' : ' ';
								$this->description .= 
									'area -> '.$newData['area_id'];
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
							case 'num_people':
								$this->description .= $listed ? ', ' : ' ';
								$this->description .= 
									'# of people -> '.$newData['num_people'];
								break;	
						}
						$listed = true;
					}
				}
			}
		} else {
			$oldData = $this->format($changes);
			$this->description = "Shift deleted: {$oldData['name']}";
		}
	}
	
	function format($data) {
		$this->Area->id = $data['area_id'];
		$this->Area->recursive = -1;
		$this->Area->schedule_id = $this->schedule_id;
		$area = $this->Area->sFind('first');
		$data['area_id'] = $area['Area']['short_name'];
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
		$data['name'] = 
			$data['area_id'].' '.
			$data['day_id'].' '.
			$data['start'].'-'.
			$data['end'];
		return $data;
	}

	function dbTime($time) {
		return  date('H:i:00',
			strtotime(
				$time['hour'].":".
				sprintf("%02d",$time['min'])." ".
				$time['meridian']
			)
		);
	}
		
	function listBySlot($person,$day,$start,$end) {
		$this->id = '';
		$this->Assignment->Person->schedule_id = $this->schedule_id;
		$this->sContain('Area','Assignment.Person.PeopleSchedules');
		$shifts = $this->sFind('all', array(
			'conditions' => array(
				'Shift.start BETWEEN ? AND ?' => array($start,$end),
				'Shift.day_id' => $day
			),
			'order' => 'Area.short_name, Shift.start, Shift.end'
		));
		$unassigned = array();
		foreach($shifts as $num => &$shift) {
			if (!$shift['Assignment']) {
				$unassigned[] = $shift;
				unset($shifts[$num]);
				continue;
			}
			foreach($shift['Assignment'] as &$assignment) {
				$this->Assignment->Person->addDisplayName($assignment['Person']);
			}
		}
		return array('unassigned' => $unassigned, 'assigned' => $shifts);
	}
}
?>
