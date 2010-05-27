<?php 
/* SVN FILE: $Id$ */
/* BoundariesController Test cases generated on: 2010-03-17 20:22:45 : 1268882565*/
App::import('Controller', 'Boundaries');

class TestBoundaries extends BoundariesController {
	var $autoRender = false;
}

class BoundariesControllerTest extends CakeTestCase {
	var $Boundaries = null;

	function startTest() {
		$this->Boundaries = new TestBoundaries();
		$this->Boundaries->constructClasses();
	}

	function testBoundariesControllerInstance() {
		$this->assertTrue(is_a($this->Boundaries, 'BoundariesController'));
	}

	function endTest() {
		unset($this->Boundaries);
	}
}
?>