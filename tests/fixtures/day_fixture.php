<?php 
/* SVN FILE: $Id$ */
/* Day Fixture generated on: 2010-03-17 20:20:36 : 1268882436*/

class DayFixture extends CakeTestFixture {
	var $name = 'Day';
	var $table = 'days';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'name' => array('type'=>'string', 'null' => false, 'length' => 30),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'name' => 'Lorem ipsum dolor sit amet'
	));
}
?>