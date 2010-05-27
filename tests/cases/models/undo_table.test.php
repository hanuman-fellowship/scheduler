<?php 
/* SVN FILE: $Id$ */
/* UndoTable Test cases generated on: 2010-04-26 21:58:20 : 1272344300*/
App::import('Model', 'UndoTable');

class UndoTableTestCase extends CakeTestCase {
	var $UndoTable = null;
	var $fixtures = array('app.undo_table', 'app.undo', 'app.undo_field');

	function startTest() {
		$this->UndoTable =& ClassRegistry::init('UndoTable');
	}

	function testUndoTableInstance() {
		$this->assertTrue(is_a($this->UndoTable, 'UndoTable'));
	}

	function testUndoTableFind() {
		$this->UndoTable->recursive = -1;
		$results = $this->UndoTable->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('UndoTable' => array(
			'id' => 1,
			'undo_id' => 1,
			'name' => 'Lorem ipsum dolor sit amet',
			'action' => 'Lorem ips',
			'record_id' => 1
		));
		$this->assertEqual($results, $expected);
	}
}
?>