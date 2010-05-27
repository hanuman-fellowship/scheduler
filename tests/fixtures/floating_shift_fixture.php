<?php 
/* SVN FILE: $Id$ */
/* FloatingShift Fixture generated on: 2010-03-15 08:45:04 : 1268667904*/

class FloatingShiftFixture extends CakeTestFixture {
	var $name = 'FloatingShift';
	var $table = 'floating_shifts';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'person_id' => array('type'=>'integer', 'null' => false),
		'area_id' => array('type'=>'integer', 'null' => false),
		'hours' => array('type'=>'float', 'null' => false),
		'note' => array('type'=>'string', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'person_id' => 1,
		'area_id' => 1,
		'hours' => 1,
		'note' => 'Lorem ipsum dolor sit amet'
	));
}
?>