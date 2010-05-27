<?php 
/* SVN FILE: $Id$ */
/* Person Test cases generated on: 2010-03-15 09:25:25 : 1268670325*/
App::import('Model', 'Person');

class PersonTestCase extends CakeTestCase {
	var $Person = null;
	var $fixtures = array('app.person', 'app.resident_category', 'app.house', 'app.floating_shift', 'app.off_day');

	function startTest() {
		$this->Person =& ClassRegistry::init('Person');
	}

	function testPersonInstance() {
		$this->assertTrue(is_a($this->Person, 'Person'));
	}

	function testPersonFind() {
		$this->Person->recursive = -1;
		$results = $this->Person->find('first');
		$this->assertTrue(!empty($results));

		$expected = array('Person' => array(
			'id' => 1,
			'nickname' => 'Lorem ipsum dolor sit amet',
			'first' => 'Lorem ipsum dolor sit amet',
			'last' => 'Lorem ipsum dolor sit amet',
			'resident_category_id' => 1,
			'house_id' => 1
		));
		$this->assertEqual($results, $expected);
	}
}
?>