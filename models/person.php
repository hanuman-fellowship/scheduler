<?php
class Person extends AppModel {

	var $name = 'Person';
	var $validate = array(
		'nickname' => array('notempty'),
		'first' => array('notempty'),
		'last' => array('notempty'),
		'resident_category_id' => array('numeric')
	);
	

	var $belongsTo = array(
		'ResidentCategory'
	);

	var $hasMany = array(
		'Assignment',
		'FloatingShift',
		'OffDay'
	);

}
?>