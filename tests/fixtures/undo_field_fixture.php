<?php 
/* SVN FILE: $Id$ */
/* UndoField Fixture generated on: 2010-04-26 21:57:46 : 1272344266*/

class UndoFieldFixture extends CakeTestFixture {
	var $name = 'UndoField';
	var $table = 'undo_fields';
	var $fields = array(
		'id' => array('type'=>'integer', 'null' => false, 'default' => NULL, 'key' => 'primary'),
		'undo_id' => array('type'=>'integer', 'null' => false),
		'undo_table_id' => array('type'=>'integer', 'null' => false),
		'field_key' => array('type'=>'string', 'null' => false, 'length' => 30),
		'field_val' => array('type'=>'text', 'null' => false),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1))
	);
	var $records = array(array(
		'id' => 1,
		'undo_id' => 1,
		'undo_table_id' => 1,
		'field_key' => 'Lorem ipsum dolor sit amet',
		'field_val' => 'Lorem ipsum dolor sit amet, aliquet feugiat. Convallis morbi fringilla gravida,phasellus feugiat dapibus velit nunc, pulvinar eget sollicitudin venenatis cum nullam,vivamus ut a sed, mollitia lectus. Nulla vestibulum massa neque ut et, id hendrerit sit,feugiat in taciti enim proin nibh, tempor dignissim, rhoncus duis vestibulum nunc mattis convallis.'
	));
}
?>