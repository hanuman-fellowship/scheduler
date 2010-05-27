<?php 
/* SVN FILE: $Id$ */
/* Undo Test cases generated on: 2010-04-26 21:57:19 : 1272344239*/
App::import('Model', 'Undo');

class UndoTestCase extends CakeTestCase {
	var $Undo = null;
	var $fixtures = array('app.undo', 'app.undo_field', 'app.undo_table');

	function startTest() {
		$this->Undo =& ClassRegistry::init('Undo');
	}

	function testUndoInstance() {
		$this->assertTrue(is_a($this->Undo, 'Undo'));
	}

	function testUndoFind() {
		$this->Undo->recursive = -1;
		$results = $this->Undo->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('Undo' => array(
			'id' => 1,
			'description' => 'Lorem ipsum dolor sit amet'
		));
		$this->assertEqual($results, $expected);
	}
}
?>