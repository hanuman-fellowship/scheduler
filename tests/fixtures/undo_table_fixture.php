<?php 
/* SVN FILE: $Id$ */
/* UndoTable Fixture generated on: 2010-04-26 21:58:20 : 1272344300*/

class UndoTableFixture extends CakeTestFixture {
	var $name = 'UndoTable';
	var $table = 'undo_tables';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'undo_id' => array('type'=>'integer', 'null' => false),
		'name' => array('type'=>'string', 'null' => false, 'length' => 30),
		'action' => array('type'=>'string', 'null' => false, 'length' => 11),
		'record_id' => array('type'=>'integer', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'undo_id' => 1,
		'name' => 'Lorem ipsum dolor sit amet',
		'action' => 'Lorem ips',
		'record_id' => 1
	));
}
?>