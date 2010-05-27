<?php
class FloatingShift extends AppModel {

	var $name = 'FloatingShift';
	var $validate = array(
		'person_id' => array('numeric'),
		'area_id' => array('numeric')
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
		'Area' => array(
			'className' => 'Area',
			'foreignKey' => 'area_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);

}
?>