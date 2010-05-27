<?php 
/* SVN FILE: $Id$ */
/* AreasController Test cases generated on: 2010-05-02 12:35:32 : 1272828932*/
App::import('Controller', 'Areas');

class TestAreas extends AreasController {
	var $autoRender = false;
}

class AreasControllerTest extends CakeTestCase {
	var $Areas = null;

	function startTest() {
		$this->Areas = new TestAreas();
		$this->Areas->constructClasses();
	}

	function testAreasControllerInstance() {
		$this->assertTrue(is_a($this->Areas, 'AreasController'));
	}

	function endTest() {
		unset($this->Areas);
	}
}
?>