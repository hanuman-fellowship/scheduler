<?php
class RequestAssignment extends AppModel {

	var $name = 'RequestAssignment';


	function save($data) {
		if (!$data['RequestAssignment']['person_id']) {
			if (trim($data['RequestAssignment']['name']) == '') return;
		}
		$data['RequestAssignment']['id'] = $this->field('id',null,'id asc') - 1; 
		parent::save($data);
	}

}
?>
