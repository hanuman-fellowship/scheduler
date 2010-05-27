<?php 
/* SVN FILE: $Id$ */
/* Time Test cases generated on: 2010-03-17 20:20:55 : 1268882455*/
App::import('Model', 'Time');

class TimeTestCase extends CakeTestCase {
	var $Time = null;
	var $fixtures = array('app.time', 'app.boundary');

	function startTest() {
		$this->Time =& ClassRegistry::init('Time');
	}

	function testTimeInstance() {
		$this->assertTrue(is_a($this->Time, 'Time'));
	}

	function testTimeFind() {
		$this->Time->recursive = -1;
		$results = $this->Time->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('Time' => array(
			'id' => 1,
			'name' => 'Lorem ipsum dolor sit amet'
		));
		$this->assertEqual($results, $expected);
	}
}
?>