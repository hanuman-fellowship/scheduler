<?php 
/* SVN FILE: $Id$ */
/* TimesController Test cases generated on: 2010-03-17 20:23:09 : 1268882589*/
App::import('Controller', 'Times');

class TestTimes extends TimesController {
	var $autoRender = false;
}

class TimesControllerTest extends CakeTestCase {
	var $Times = null;

	function startTest() {
		$this->Times = new TestTimes();
		$this->Times->constructClasses();
	}

	function testTimesControllerInstance() {
		$this->assertTrue(is_a($this->Times, 'TimesController'));
	}

	function endTest() {
		unset($this->Times);
	}
}
?>