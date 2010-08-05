<?php
class Setting extends AppModel {

	var $name = 'Setting';

	var $belongsTo = array(
		'User'
	);
}
?>
