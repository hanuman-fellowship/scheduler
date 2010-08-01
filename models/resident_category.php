<?php
class ResidentCategory extends AppModel {

	var $name = 'ResidentCategory';

	var $hasMany = array(
		'ConstantShift',
		'Person'
	);

}
?>
