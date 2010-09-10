<?php
class RequestAssignment extends AppModel {

	var $name = 'RequestAssignment';


	function save($data) {
		$data['RequestAssignment']['id'] = $this->field('id',null,'id asc') - 1; 
		parent::save($data);
	}

}
?>
