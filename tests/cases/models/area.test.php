<?php 
/* SVN FILE: $Id$ */
/* Area Test cases generated on: 2010-03-15 09:24:41 : 1268670281*/
App::import('Model', 'Area');

class AreaTestCase extends CakeTestCase {
	var $Area = null;
	var $fixtures = array('app.area', 'app.floating_shift', 'app.shift');

	function startTest() {
		$this->Area =& ClassRegistry::init('Area');
	}

	function testAreaInstance() {
		$this->assertTrue(is_a($this->Area, 'Area'));
	}

	function testAreaFind() {
		$this->Area->recursive = -1;
		$results = $this->Area->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('Area' => array(
			'id' => 1,
			'name' => 'Lorem ipsum dolor sit amet',
			'short_name' => 'Lorem ip'
		));
		$this->assertEqual($results, $expected);
	}
}
?>