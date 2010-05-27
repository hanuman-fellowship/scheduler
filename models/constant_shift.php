<?php
class ConstantShift extends AppModel {

	var $name = 'ConstantShift';
	var $validate = array(
		'resident_category_id' => array('numeric'),
		'name' => array('notempty'),
		'day' => array('numeric')
	);

	//The Associations below have been created with all possible keys, those that are not needed can be removed
	var $belongsTo = array(
		'ResidentCategory' => array(
			'className' => 'ResidentCategory',
			'foreignKey' => 'resident_category_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);

}
?>