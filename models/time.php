<?php
class Time extends AppModel {

	var $name = 'Time';

	//The Associations below have been created with all possible keys, those that are not needed can be removed
	var $hasMany = array(
		'Boundary' => array(
			'className' => 'Boundary',
			'foreignKey' => 'time_id',
			'dependent' => false,
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'limit' => '',
			'offset' => '',
			'exclusive' => '',
			'finderQuery' => '',
			'counterQuery' => ''
		)
	);

}
?>