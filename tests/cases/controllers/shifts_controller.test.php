<?php 
/* SVN FILE: $Id$ */
/* ShiftsController Test cases generated on: 2010-05-02 12:34:35 : 1272828875*/
App::import('Controller', 'Shifts');

class TestShifts extends ShiftsController {
	var $autoRender = false;
}

class ShiftsControllerTest extends CakeTestCase {
	var $Shifts = null;

	function startTest() {
		$this->Shifts = new TestShifts();
		$this->Shifts->constructClasses();
	}

	function testShiftsControllerInstance() {
		$this->assertTrue(is_a($this->Shifts, 'ShiftsController'));
	}

	function endTest() {
		unset($this->Shifts);
	}
}
?>