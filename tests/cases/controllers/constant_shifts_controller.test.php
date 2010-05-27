<?php 
/* SVN FILE: $Id$ */
/* ConstantShiftsController Test cases generated on: 2010-03-15 09:50:54 : 1268671854*/
App::import('Controller', 'ConstantShifts');

class TestConstantShifts extends ConstantShiftsController {
	var $autoRender = false;
}

class ConstantShiftsControllerTest extends CakeTestCase {
	var $ConstantShifts = null;

	function startTest() {
		$this->ConstantShifts = new TestConstantShifts();
		$this->ConstantShifts->constructClasses();
	}

	function testConstantShiftsControllerInstance() {
		$this->assertTrue(is_a($this->ConstantShifts, 'ConstantShiftsController'));
	}

	function endTest() {
		unset($this->ConstantShifts);
	}
}
?>