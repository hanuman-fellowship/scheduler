<?php 
/* SVN FILE: $Id$ */
/* Manager Fixture generated on: 2010-03-15 09:18:28 : 1268669908*/

class ManagerFixture extends CakeTestFixture {
	var $name = 'Manager';
	var $table = 'managers';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'person_id' => array('type'=>'integer', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'person_id' => 1
	));
}
?>