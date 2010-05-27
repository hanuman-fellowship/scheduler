<?php 
/* SVN FILE: $Id$ */
/* Shift Test cases generated on: 2010-03-15 08:49:51 : 1268668191*/
App::import('Model', 'Shift');

class ShiftTestCase extends CakeTestCase {
	var $Shift = null;
	var $fixtures = array('app.shift', 'app.area');

	function startTest() {
		$this->Shift =& ClassRegistry::init('Shift');
	}

	function testShiftInstance() {
		$this->assertTrue(is_a($this->Shift, 'Shift'));
	}

	function testShiftFind() {
		$this->Shift->recursive = -1;
		$results = $this->Shift->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('Shift' => array(
			'id' => 1,
			'area_id' => 1,
			'day' => 1,
			'time' => 1,
			'length' => 1,
			'num_people' => 1
		));
		$this->assertEqual($results, $expected);
	}
}
?>