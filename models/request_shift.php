<?php
class RequestShift extends AppModel {

	var $name = 'RequestShift';

	var $hasMany = array(
		'RequestAssignment'
	);

	function valid($data) {
		$start = $this->dbTime($data['RequestShift']['start']);
		$end = $this->dbTime($data['RequestShift']['end']);
		if ($end <= $start) {	
			$this->errorField = 'start';
			$this->errorMessage = "Oops! Those hours don't make sense";
			return false;
		}
		$num_people = $data['RequestShift']['num_people'];
		if (!is_numeric($num_people) ||	$num_people < 1) {
			$this->errorField = 'num_people';
			$this->errorMessage = "Invalid # of people";
			return false;
		}	
		if (isset($data['RequestShift']['id'])) {
			$this->contain('RequestAssignment');
			$this->id = $data['RequestShift']['id'];
			$shift = $this->find('first',array(
				'conditions' => array('RequestShift.id' => $this->id)
			));
			$num_assigned = count($shift['RequestAssignment']);
			if ($num_people < $num_assigned) {
				$this->errorField = 'num_people';
				$this->errorMessage = "Too many people already assigned";
				return false;
			}
		}
		return true;
	}

	function save($data) {
		$times = array('start', 'end');
		foreach($times as $time) {
			$data['RequestShift'][$time] = $this->dbTime($data['RequestShift'][$time]);
		}
		$data['RequestShift']['id'] = isset($data['RequestShift']['id']) ?
			$data['RequestShift']['id'] : $this->field('id',null,'id asc') - 1; 
		parent::save($data);
	}
	
	function delete($id) {
		$this->contain('RequestAssignment');
		$shift = $this->find('first', array(
			'conditions' => array('RequestShift.id' => $id)
		));
		foreach($shift['RequestAssignment'] as $assignment) {
			$this->RequestAssignment->delete($assignment['id']);
		}
		parent::delete($id);
	}
}
?>
