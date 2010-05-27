<?php 
/* SVN FILE: $Id$ */
/* ConstantShift Fixture generated on: 2010-03-15 08:44:18 : 1268667858*/

class ConstantShiftFixture extends CakeTestFixture {
	var $name = 'ConstantShift';
	var $table = 'constant_shifts';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'resident_category_id' => array('type'=>'integer', 'null' => false),
		'name' => array('type'=>'string', 'null' => false, 'length' => 30),
		'day' => array('type'=>'integer', 'null' => false),
		'start' => array('type'=>'float', 'null' => false),
		'end' => array('type'=>'float', 'null' => false),
		'length' => array('type'=>'float', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'resident_category_id' => 1,
		'name' => 'Lorem ipsum dolor sit amet',
		'day' => 1,
		'start' => 1,
		'end' => 1,
		'length' => 1
	));
}
?>