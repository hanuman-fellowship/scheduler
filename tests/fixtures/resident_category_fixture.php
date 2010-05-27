<?php 
/* SVN FILE: $Id$ */
/* ResidentCategory Fixture generated on: 2010-03-15 08:48:33 : 1268668113*/

class ResidentCategoryFixture extends CakeTestFixture {
	var $name = 'ResidentCategory';
	var $table = 'resident_categories';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'name' => array('type'=>'string', 'null' => false, 'length' => 30),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'name' => 'Lorem ipsum dolor sit amet'
	));
}
?>