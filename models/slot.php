<?php
class Slot extends AppModel {

	var $name = 'Slot';

	var $hasMany = array(
		'Boundary'
	);

}
?>