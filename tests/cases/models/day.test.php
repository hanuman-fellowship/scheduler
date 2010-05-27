<?php 
/* SVN FILE: $Id$ */
/* Day Test cases generated on: 2010-03-17 20:20:36 : 1268882436*/
App::import('Model', 'Day');

class DayTestCase extends CakeTestCase {
	var $Day = null;
	var $fixtures = array('app.day', 'app.boundary');

	function startTest() {
		$this->Day =& ClassRegistry::init('Day');
	}

	function testDayInstance() {
		$this->assertTrue(is_a($this->Day, 'Day'));
	}

	function testDayFind() {
		$this->Day->recursive = -1;
		$results = $this->Day->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('Day' => array(
			'id' => 1,
			'name' => 'Lorem ipsum dolor sit amet'
		));
		$this->assertEqual($results, $expected);
	}
}
?>