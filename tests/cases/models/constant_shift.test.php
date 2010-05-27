<?php 
/* SVN FILE: $Id$ */
/* ConstantShift Test cases generated on: 2010-03-15 08:44:18 : 1268667858*/
App::import('Model', 'ConstantShift');

class ConstantShiftTestCase extends CakeTestCase {
	var $ConstantShift = null;
	var $fixtures = array('app.constant_shift', 'app.resident_category');

	function startTest() {
		$this->ConstantShift =& ClassRegistry::init('ConstantShift');
	}

	function testConstantShiftInstance() {
		$this->assertTrue(is_a($this->ConstantShift, 'ConstantShift'));
	}

	function testConstantShiftFind() {
		$this->ConstantShift->recursive = -1;
		$results = $this->ConstantShift->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('ConstantShift' => array(
			'id' => 1,
			'resident_category_id' => 1,
			'name' => 'Lorem ipsum dolor sit amet',
			'day' => 1,
			'start' => 1,
			'end' => 1,
			'length' => 1
		));
		$this->assertEqual($results, $expected);
	}
}
?>