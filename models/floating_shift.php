<?php
class FloatingShift extends AppModel {

	var $name = 'FloatingShift';
	var $validate = array(
		'person_id' => array('numeric'),
		'area_id' => array('numeric')
	);

	var $belongsTo = array(
		'Person',
		'Area'
	);

}
?>