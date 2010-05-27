<?php 
/* SVN FILE: $Id$ */
/* OffDay Fixture generated on: 2010-03-15 08:46:30 : 1268667990*/

class OffDayFixture extends CakeTestFixture {
	var $name = 'OffDay';
	var $table = 'off_days';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'day' => array('type'=>'integer', 'null' => false),
		'person_id' => array('type'=>'integer', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'day' => 1,
		'person_id' => 1
	));
}
?>