<?php 
/* SVN FILE: $Id$ */
/* ResidentCategory Test cases generated on: 2010-03-15 08:48:33 : 1268668113*/
App::import('Model', 'ResidentCategory');

class ResidentCategoryTestCase extends CakeTestCase {
	var $ResidentCategory = null;
	var $fixtures = array('app.resident_category', 'app.constant_shift', 'app.person');

	function startTest() {
		$this->ResidentCategory =& ClassRegistry::init('ResidentCategory');
	}

	function testResidentCategoryInstance() {
		$this->assertTrue(is_a($this->ResidentCategory, 'ResidentCategory'));
	}

	function testResidentCategoryFind() {
		$this->ResidentCategory->recursive = -1;
		$results = $this->ResidentCategory->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('ResidentCategory' => array(
			'id' => 1,
			'name' => 'Lorem ipsum dolor sit amet'
		));
		$this->assertEqual($results, $expected);
	}
}
?>