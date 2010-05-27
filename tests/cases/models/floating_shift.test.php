<?php 
/* SVN FILE: $Id$ */
/* FloatingShift Test cases generated on: 2010-03-15 08:45:04 : 1268667904*/
App::import('Model', 'FloatingShift');

class FloatingShiftTestCase extends CakeTestCase {
	var $FloatingShift = null;
	var $fixtures = array('app.floating_shift', 'app.person', 'app.area');

	function startTest() {
		$this->FloatingShift =& ClassRegistry::init('FloatingShift');
	}

	function testFloatingShiftInstance() {
		$this->assertTrue(is_a($this->FloatingShift, 'FloatingShift'));
	}

	function testFloatingShiftFind() {
		$this->FloatingShift->recursive = -1;
		$results = $this->FloatingShift->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('FloatingShift' => array(
			'id' => 1,
			'person_id' => 1,
			'area_id' => 1,
			'hours' => 1,
			'note' => 'Lorem ipsum dolor sit amet'
		));
		$this->assertEqual($results, $expected);
	}
}
?>