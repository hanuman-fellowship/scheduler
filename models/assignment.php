<?php
class Assignment extends AppModel {

	var $name = 'Assignment';

	var $belongsTo = array(
		'Person',
		'Shift'
	);

}
?>