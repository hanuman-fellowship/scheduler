<?php 
/* SVN FILE: $Id$ */
/* Boundary Fixture generated on: 2010-03-17 20:20:08 : 1268882408*/

class BoundaryFixture extends CakeTestFixture {
	var $name = 'Boundary';
	var $table = 'boundaries';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'day_id' => array('type'=>'integer', 'null' => false),
		'time_id' => array('type'=>'integer', 'null' => false),
		'start' => array('type'=>'float', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'day_id' => 1,
		'time_id' => 1,
		'start' => 1
	));
}
?>