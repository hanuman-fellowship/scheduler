<?php
class Profile extends AppModel {

	var $name = 'Profile';

	var $belongsTo = array(
		'Person'
	);

	var $hasMany = array(
		'ProfileNote'
	);
}
?>
