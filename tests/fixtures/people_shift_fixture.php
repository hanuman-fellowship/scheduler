<?php 
/* SVN FILE: $Id$ */
/* PeopleShift Fixture generated on: 2010-03-15 08:48:02 : 1268668082*/

class PeopleShiftFixture extends CakeTestFixture {
	var $name = 'PeopleShift';
	var $table = 'people_shifts';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'person_id' => array('type'=>'integer', 'null' => false),
		'shift_id' => array('type'=>'integer', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'person_id' => 1,
		'shift_id' => 1
	));
}
?>