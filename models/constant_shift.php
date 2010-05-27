<?php
class ConstantShift extends AppModel {

	var $name = 'ConstantShift';
	var $validate = array(
		'resident_category_id' => array('numeric'),
		'name' => array('notempty'),
		'day' => array('numeric')
	);

	var $belongsTo = array(
		'ResidentCategory'
	);

}
?>