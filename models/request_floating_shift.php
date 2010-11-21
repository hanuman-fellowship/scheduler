<?
class RequestFloatingShift extends AppModel {

	var $name = 'RequestFloatingShift';

	var $belongsTo = array(
		'RequestArea',
		'Person'
	);

	

	function valid($data) {
		$hours = $data['RequestFloatingShift']['hours'];
		if (!is_numeric($hours) || $hours <= 0) {
			$this->errorField = 'hours';
			$this->errorMessage = "Invalid # of hours";
			return false;
		}
		return true;
	}

	function save($data) {
		$data['RequestFloatingShift']['id'] = isset($data['RequestFloatingShift']['id']) ?
			$data['RequestFloatingShift']['id'] : $this->field('id',null,'id asc') - 1; 
		parent::save($data);
	}
}
