<?php 
/* SVN FILE: $Id$ */
/* House Fixture generated on: 2010-03-15 08:46:10 : 1268667970*/

class HouseFixture extends CakeTestFixture {
	var $name = 'House';
	var $table = 'houses';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'name' => array('type'=>'string', 'null' => false, 'length' => 30),
		'size' => array('type'=>'integer', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'name' => 'Lorem ipsum dolor sit amet',
		'size' => 1
	));
}
?>