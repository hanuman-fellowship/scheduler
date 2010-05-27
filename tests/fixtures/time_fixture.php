<?php 
/* SVN FILE: $Id$ */
/* Time Fixture generated on: 2010-03-17 20:20:54 : 1268882454*/

class TimeFixture extends CakeTestFixture {
	var $name = 'Time';
	var $table = 'times';
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