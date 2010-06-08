<?php
class Shift extends AppModel {

	var $name = 'Shift';
	var $validate = array(
		'area_id' => array('numeric'),
		'day_id' => array('numeric'),
		'num_people' => array('numeric')
	);

	var $belongsTo = array(
		'Area'
	);
	
	var $hasMany = array(
		'Assignment'
	);
	
	function sSave($data) {
		$times = array('start', 'end');
		foreach($times as $time) {
			$data['Shift'][$time] = date('H:i:00',
				strtotime(
					$data['Shift'][$time]['hour'].":".
					sprintf("%02d",$data['Shift'][$time]['min'])." ".
					$data['Shift'][$time]['meridian']
				)
			);
		}
		$changes = parent::sSave($data);
		debug($changes);
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
	}
	
}
?>