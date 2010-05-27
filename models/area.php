<?php
class Area extends AppModel {

	var $name = 'Area';
	var $validate = array(
		'name' => array('notempty'),
		'short_name' => array('notempty')
	);

	var $hasMany = array(
		'FloatingShift',
		'Shift'
	);

}
?>