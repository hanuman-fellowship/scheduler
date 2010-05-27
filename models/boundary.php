<?php
class Boundary extends AppModel {

	var $name = 'Boundary';

	var $belongsTo = array(
		'Day',
		'Slot'
	);

}
?>