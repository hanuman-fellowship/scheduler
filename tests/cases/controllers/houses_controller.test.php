<?php 
/* SVN FILE: $Id$ */
/* HousesController Test cases generated on: 2010-03-15 09:51:13 : 1268671873*/
App::import('Controller', 'Houses');

class TestHouses extends HousesController {
	var $autoRender = false;
}

class HousesControllerTest extends CakeTestCase {
	var $Houses = null;

	function startTest() {
		$this->Houses = new TestHouses();
		$this->Houses->constructClasses();
	}

	function testHousesControllerInstance() {
		$this->assertTrue(is_a($this->Houses, 'HousesController'));
	}

	function endTest() {
		unset($this->Houses);
	}
}
?>