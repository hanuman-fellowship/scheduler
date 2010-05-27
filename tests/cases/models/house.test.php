<?php 
/* SVN FILE: $Id$ */
/* House Test cases generated on: 2010-03-15 08:46:10 : 1268667970*/
App::import('Model', 'House');

class HouseTestCase extends CakeTestCase {
	var $House = null;
	var $fixtures = array('app.house', 'app.person');

	function startTest() {
		$this->House =& ClassRegistry::init('House');
	}

	function testHouseInstance() {
		$this->assertTrue(is_a($this->House, 'House'));
	}

	function testHouseFind() {
		$this->House->recursive = -1;
		$results = $this->House->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('House' => array(
			'id' => 1,
			'name' => 'Lorem ipsum dolor sit amet',
			'size' => 1
		));
		$this->assertEqual($results, $expected);
	}
}
?>