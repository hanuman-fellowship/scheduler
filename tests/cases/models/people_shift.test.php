<?php 
/* SVN FILE: $Id$ */
/* PeopleShift Test cases generated on: 2010-03-15 08:48:02 : 1268668082*/
App::import('Model', 'PeopleShift');

class PeopleShiftTestCase extends CakeTestCase {
	var $PeopleShift = null;
	var $fixtures = array('app.people_shift', 'app.person', 'app.shift');

	function startTest() {
		$this->PeopleShift =& ClassRegistry::init('PeopleShift');
	}

	function testPeopleShiftInstance() {
		$this->assertTrue(is_a($this->PeopleShift, 'PeopleShift'));
	}

	function testPeopleShiftFind() {
		$this->PeopleShift->recursive = -1;
		$results = $this->PeopleShift->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('PeopleShift' => array(
			'id' => 1,
			'person_id' => 1,
			'shift_id' => 1
		));
		$this->assertEqual($results, $expected);
	}
}
?>