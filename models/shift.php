<?php
class Shift extends AppModel {

	var $name = 'Shift';
	var $validate = array(
		'area_id' => array('numeric'),
		'day' => array('numeric'),
		'num_people' => array('numeric')
	);

	//The Associations below have been created with all possible keys, those that are not needed can be removed
	var $belongsTo = array(
		'Area' => array(
			'className' => 'Area',
			'foreignKey' => 'area_id',
			'conditions' => '',
			'fields' => '',
			'order' => ''
		)
	);

	var $hasAndBelongsToMany = array(
		'Person' => array(
			'className' => 'Person',
			'joinTable' => 'people_shifts',
			'foreignKey' => 'shift_id',
			'associationForeignKey' => 'person_id',
			'unique' => true,
			'conditions' => '',
			'fields' => '',
			'order' => 'resident_category_id,name',
			'limit' => '',
			'offset' => '',
			'finderQuery' => '',
			'deleteQuery' => '',
			'insertQuery' => ''
		)
	);

}
?>