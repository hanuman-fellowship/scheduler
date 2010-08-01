<?php
class Day extends AppModel {

	var $name = 'Day';

	var $hasMany = array(
		'Boundary'
	);

	function getShortName($day_id) {
		$day = $this->sFind('first',array(
			'recursive' => -1,
			'conditions' => array(
				'Day.id' => $day_id
			),
			'fields' => array('Day.name')
		));
		return substr($day['Day']['name'],0,3);
	}
}
?>
