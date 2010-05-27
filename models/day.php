<?php
class Day extends AppModel {

	var $name = 'Day';

	var $hasMany = array(
		'Boundary'
	);

}
?>