<?php
class Boundary extends AppModel {

	var $name = 'Boundary';

	//The Associations below have been created with all possible keys, those that are not needed can be removed
	var $belongsTo = array(
		'Day' => array(
			'className' => 'Day',
			'foreignKey' => 'day_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		),
		'Time' => array(
			'className' => 'Time',
			'foreignKey' => 'time_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);

}
?>