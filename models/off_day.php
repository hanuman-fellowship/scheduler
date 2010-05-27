<?php
class OffDay extends AppModel {

	var $name = 'OffDay';
	var $validate = array(
		'day' => array('numeric'),
		'person_id' => array('numeric')
	);

	//The Associations below have been created with all possible keys, those that are not needed can be removed
	var $belongsTo = array(
		'Person' => array(
			'className' => 'Person',
			'foreignKey' => 'person_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);

}
?>