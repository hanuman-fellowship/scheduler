<?php 
/* SVN FILE: $Id$ */
/* FloatingShiftsController Test cases generated on: 2010-03-15 09:51:06 : 1268671866*/
App::import('Controller', 'FloatingShifts');

class TestFloatingShifts extends FloatingShiftsController {
	var $autoRender = false;
}

class FloatingShiftsControllerTest extends CakeTestCase {
	var $FloatingShifts = null;

	function startTest() {
		$this->FloatingShifts = new TestFloatingShifts();
		$this->FloatingShifts->constructClasses();
	}

	function testFloatingShiftsControllerInstance() {
		$this->assertTrue(is_a($this->FloatingShifts, 'FloatingShiftsController'));
	}

	function endTest() {
		unset($this->FloatingShifts);
	}
}
?>