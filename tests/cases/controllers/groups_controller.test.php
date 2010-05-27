<?php 
/* SVN FILE: $Id$ */
/* GroupsController Test cases generated on: 2010-04-16 14:03:43 : 1271451823*/
App::import('Controller', 'Groups');

class TestGroups extends GroupsController {
	var $autoRender = false;
}

class GroupsControllerTest extends CakeTestCase {
	var $Groups = null;

	function startTest() {
		$this->Groups = new TestGroups();
		$this->Groups->constructClasses();
	}

	function testGroupsControllerInstance() {
		$this->assertTrue(is_a($this->Groups, 'GroupsController'));
	}

	function endTest() {
		unset($this->Groups);
	}
}
?>