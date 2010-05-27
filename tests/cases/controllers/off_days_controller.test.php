<?php 
/* SVN FILE: $Id$ */
/* OffDaysController Test cases generated on: 2010-03-15 09:51:20 : 1268671880*/
App::import('Controller', 'OffDays');

class TestOffDays extends OffDaysController {
	var $autoRender = false;
}

class OffDaysControllerTest extends CakeTestCase {
	var $OffDays = null;

	function startTest() {
		$this->OffDays = new TestOffDays();
		$this->OffDays->constructClasses();
	}

	function testOffDaysControllerInstance() {
		$this->assertTrue(is_a($this->OffDays, 'OffDaysController'));
	}

	function endTest() {
		unset($this->OffDays);
	}
}
?>