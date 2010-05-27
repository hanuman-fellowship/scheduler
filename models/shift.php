<?php
class Shift extends AppModel {

	var $name = 'Shift';
	var $validate = array(
		'area_id' => array('numeric'),
		'day' => array('numeric'),
		'num_people' => array('numeric')
	);

	var $belongsTo = array(
		'Area'
	);
	
	var $hasMany = array(
		'Assignment'
	);

}
?>