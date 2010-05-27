<?php 
/* SVN FILE: $Id$ */
/* DaysController Test cases generated on: 2010-03-17 20:22:56 : 1268882576*/
App::import('Controller', 'Days');

class TestDays extends DaysController {
	var $autoRender = false;
}

class DaysControllerTest extends CakeTestCase {
	var $Days = null;

	function startTest() {
		$this->Days = new TestDays();
		$this->Days->constructClasses();
	}

	function testDaysControllerInstance() {
		$this->assertTrue(is_a($this->Days, 'DaysController'));
	}

	function endTest() {
		unset($this->Days);
	}
}
?>