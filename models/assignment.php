<?php
class Assignment extends AppModel {

	var $name = 'Assignment';

	var $belongsTo = array(
		'Person',
		'Shift'
	);
	
	function info() {
		$this->sContain('Person','Shift.Area');
		$info = $this->sFind('first');	
		$this->description = "{$info['Person']['name']} assigned to {$info['Shift']['Area']['name']} shift";	
		$this->area_id     = $info['Shift']['Area']['id'];	
	}

	function sSave($data) {
		$changes = parent::sSave($data);
		//debug($changes);
	}

	
}
?>