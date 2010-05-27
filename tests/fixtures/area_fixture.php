<?php 
/* SVN FILE: $Id$ */
/* Area Fixture generated on: 2010-03-15 09:24:39 : 1268670279*/

class AreaFixture extends CakeTestFixture {
	var $name = 'Area';
	var $table = 'areas';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'name' => array('type'=>'string', 'null' => false, 'length' => 30),
		'short_name' => array('type'=>'string', 'null' => false, 'length' => 10),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'name' => 'Lorem ipsum dolor sit amet',
		'short_name' => 'Lorem ip'
	));
}
?>