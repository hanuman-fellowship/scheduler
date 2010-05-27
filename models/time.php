<?php
class Time extends AppModel {

	var $name = 'Time';

	var $hasMany = array(
		'Boundary'
	);

}
?>