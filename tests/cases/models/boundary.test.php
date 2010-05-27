<?php 
/* SVN FILE: $Id$ */
/* Boundary Test cases generated on: 2010-03-17 20:20:08 : 1268882408*/
App::import('Model', 'Boundary');

class BoundaryTestCase extends CakeTestCase {
	var $Boundary = null;
	var $fixtures = array('app.boundary', 'app.day', 'app.time');

	function startTest() {
		$this->Boundary =& ClassRegistry::init('Boundary');
	}

	function testBoundaryInstance() {
		$this->assertTrue(is_a($this->Boundary, 'Boundary'));
	}

	function testBoundaryFind() {
		$this->Boundary->recursive = -1;
		$results = $this->Boundary->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('Boundary' => array(
			'id' => 1,
			'day_id' => 1,
			'time_id' => 1,
			'start' => 1
		));
		$this->assertEqual($results, $expected);
	}
}
?>