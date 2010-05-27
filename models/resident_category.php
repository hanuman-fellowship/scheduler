<?php
class ResidentCategory extends AppModel {

	var $name = 'ResidentCategory';
	var $validate = array(
		'name' => array('notempty')
	);

	var $hasMany = array(
		'ConstantShift',
		'Person'
	);

}
?>