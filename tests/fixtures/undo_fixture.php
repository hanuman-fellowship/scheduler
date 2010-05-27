<?php 
/* SVN FILE: $Id$ */
/* Undo Fixture generated on: 2010-04-26 21:57:19 : 1272344239*/

class UndoFixture extends CakeTestFixture {
	var $name = 'Undo';
	var $table = 'undos';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'description' => array('type'=>'string', 'null' => false, 'length' => 30),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'description' => 'Lorem ipsum dolor sit amet'
	));
}
?>