<?php 
/* SVN FILE: $Id$ */
/* ResidentCategoriesController Test cases generated on: 2010-03-15 09:51:44 : 1268671904*/
App::import('Controller', 'ResidentCategories');

class TestResidentCategories extends ResidentCategoriesController {
	var $autoRender = false;
}

class ResidentCategoriesControllerTest extends CakeTestCase {
	var $ResidentCategories = null;

	function startTest() {
		$this->ResidentCategories = new TestResidentCategories();
		$this->ResidentCategories->constructClasses();
	}

	function testResidentCategoriesControllerInstance() {
		$this->assertTrue(is_a($this->ResidentCategories, 'ResidentCategoriesController'));
	}

	function endTest() {
		unset($this->ResidentCategories);
	}
}
?>