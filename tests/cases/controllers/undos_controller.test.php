<?php 
/* SVN FILE: $Id$ */
/* UndosController Test cases generated on: 2010-04-27 11:07:32 : 1272391652*/
App::import('Controller', 'Undos');

class TestUndos extends UndosController {
	var $autoRender = false;
}

class UndosControllerTest extends CakeTestCase {
	var $Undos = null;

	function startTest() {
		$this->Undos = new TestUndos();
		$this->Undos->constructClasses();
	}

	function testUndosControllerInstance() {
		$this->assertTrue(is_a($this->Undos, 'UndosController'));
	}

	function endTest() {
		unset($this->Undos);
	}
}
?>