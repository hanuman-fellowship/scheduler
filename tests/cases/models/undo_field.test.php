<?php 
/* SVN FILE: $Id$ */
/* UndoField Test cases generated on: 2010-04-26 21:57:46 : 1272344266*/
App::import('Model', 'UndoField');

class UndoFieldTestCase extends CakeTestCase {
	var $UndoField = null;
	var $fixtures = array('app.undo_field', 'app.undo', 'app.undo_table');

	function startTest() {
		$this->UndoField =& ClassRegistry::init('UndoField');
	}

	function testUndoFieldInstance() {
		$this->assertTrue(is_a($this->UndoField, 'UndoField'));
	}

	function testUndoFieldFind() {
		$this->UndoField->recursive = -1;
		$results = $this->UndoField->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('UndoField' => array(
			'id' => 1,
			'undo_id' => 1,
			'undo_table_id' => 1,
			'field_key' => 'Lorem ipsum dolor sit amet',
			'field_val' => 'Lorem ipsum dolor sit amet, aliquet feugiat. Convallis morbi fringilla gravida,phasellus feugiat dapibus velit nunc, pulvinar eget sollicitudin venenatis cum nullam,vivamus ut a sed, mollitia lectus. Nulla vestibulum massa neque ut et, id hendrerit sit,feugiat in taciti enim proin nibh, tempor dignissim, rhoncus duis vestibulum nunc mattis convallis.'
		));
		$this->assertEqual($results, $expected);
	}
}
?>