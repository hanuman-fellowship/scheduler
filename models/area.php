<?php
class Area extends AppModel {

	var $name = 'Area';
	var $validate = array(
		'name' => array('notempty'),
		'short_name' => array('notempty')
	);
	var $actsAs = array('Containable');

	//The Associations below have been created with all possible keys, those that are not needed can be removed
	var $hasMany = array(
		'FloatingShift' => array(
			'className' => 'FloatingShift',
			'foreignKey' => 'area_id',
			'dependent' => false,
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'limit' => '',
			'offset' => '',
			'exclusive' => '',
			'finderQuery' => '',
			'counterQuery' => ''
		),
		'Shift' => array(
			'className' => 'Shift',
			'foreignKey' => 'area_id',
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