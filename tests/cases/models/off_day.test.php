<?php 
/* SVN FILE: $Id$ */
/* OffDay Test cases generated on: 2010-03-15 08:46:30 : 1268667990*/
App::import('Model', 'OffDay');

class OffDayTestCase extends CakeTestCase {
	var $OffDay = null;
	var $fixtures = array('app.off_day', 'app.person');

	function startTest() {
		$this->OffDay =& ClassRegistry::init('OffDay');
	}

	function testOffDayInstance() {
		$this->assertTrue(is_a($this->OffDay, 'OffDay'));
	}

	function testOffDayFind() {
		$this->OffDay->recursive = -1;
		$results = $this->OffDay->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('OffDay' => array(
			'id' => 1,
			'day' => 1,
			'person_id' => 1
		));
		$this->assertEqual($results, $expected);
	}
}
?>