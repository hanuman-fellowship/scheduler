<?php 
/* SVN FILE: $Id$ */
/* Shift Fixture generated on: 2010-03-15 08:49:51 : 1268668191*/

class ShiftFixture extends CakeTestFixture {
	var $name = 'Shift';
	var $table = 'shifts';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'area_id' => array('type'=>'integer', 'null' => false),
		'day' => array('type'=>'integer', 'null' => false),
		'time' => array('type'=>'float', 'null' => false),
		'length' => array('type'=>'float', 'null' => false),
		'num_people' => array('type'=>'integer', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'area_id' => 1,
		'day' => 1,
		'time' => 1,
		'length' => 1,
		'num_people' => 1
	));
}
?>