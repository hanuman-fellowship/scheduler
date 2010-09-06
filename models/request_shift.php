<?php
class RequestShift extends AppModel {

	var $name = 'RequestShift';

	var $hasMany = array(
		'RequestAssignment'
	);

}
?>
