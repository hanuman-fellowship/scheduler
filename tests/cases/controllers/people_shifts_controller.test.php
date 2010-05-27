<?php 
/* SVN FILE: $Id$ */
/* PeopleShiftsController Test cases generated on: 2010-03-15 09:51:39 : 1268671899*/
App::import('Controller', 'PeopleShifts');

class TestPeopleShifts extends PeopleShiftsController {
	var $autoRender = false;
}

class PeopleShiftsControllerTest extends CakeTestCase {
	var $PeopleShifts = null;

	function startTest() {
		$this->PeopleShifts = new TestPeopleShifts();
		$this->PeopleShifts->constructClasses();
	}

	function testPeopleShiftsControllerInstance() {
		$this->assertTrue(is_a($this->PeopleShifts, 'PeopleShiftsController'));
	}

	function endTest() {
		unset($this->PeopleShifts);
	}
}
?>