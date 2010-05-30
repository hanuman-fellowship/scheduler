<?php
class Shift extends AppModel {

	var $name = 'Shift';
	var $validate = array(
		'area_id' => array('numeric'),
		'day' => array('numeric'),
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
		if (parent::sSave($data)) {
			return true;
		}
	}
	
}
?>