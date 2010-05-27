<?php
class PeopleShift extends AppModel {

	var $name = 'PeopleShift';
	var $validate = array(
		'person_id' => array('numeric'),
		'shift_id' => array('numeric')
	);

	//The Associations below have been created with all possible keys, those that are not needed can be removed
	var $belongsTo = array(
		'Person' => array(
			'className' => 'Person',
			'foreignKey' => 'person_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		),
		'Shift' => array(
			'className' => 'Shift',
			'foreignKey' => 'shift_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);

}
?>