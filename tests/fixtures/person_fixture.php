<?php 
/* SVN FILE: $Id$ */
/* Person Fixture generated on: 2010-03-15 09:25:24 : 1268670324*/

class PersonFixture extends CakeTestFixture {
	var $name = 'Person';
	var $table = 'people';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'nickname' => array('type'=>'string', 'null' => false, 'length' => 30),
		'first' => array('type'=>'string', 'null' => false, 'length' => 30),
		'last' => array('type'=>'string', 'null' => false, 'length' => 30),
		'resident_category_id' => array('type'=>'integer', 'null' => false),
		'house_id' => array('type'=>'integer', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'nickname' => 'Lorem ipsum dolor sit amet',
		'first' => 'Lorem ipsum dolor sit amet',
		'last' => 'Lorem ipsum dolor sit amet',
		'resident_category_id' => 1,
		'house_id' => 1
	));
}
?>