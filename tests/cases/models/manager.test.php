<?php 
/* SVN FILE: $Id$ */
/* Manager Test cases generated on: 2010-03-15 09:18:28 : 1268669908*/
App::import('Model', 'Manager');

class ManagerTestCase extends CakeTestCase {
	var $Manager = null;
	var $fixtures = array('app.manager', 'app.person', 'app.area');

	function startTest() {
		$this->Manager =& ClassRegistry::init('Manager');
	}

	function testManagerInstance() {
		$this->assertTrue(is_a($this->Manager, 'Manager'));
	}

	function testManagerFind() {
		$this->Manager->recursive = -1;
		$results = $this->Manager->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('Manager' => array(
			'id' => 1,
			'person_id' => 1
		));
		$this->assertEqual($results, $expected);
	}
}
?>