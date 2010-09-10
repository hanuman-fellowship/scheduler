<?php
class RequestShiftsController extends AppController {

	var $name = 'RequestShifts';

	function add($area_id = null,$day_id = null, $start = null, $end = null) {
		if (!empty($this->data)) {
			if ($this->RequestShift->valid($this->data)) {
				$this->RequestShift->create();
				$this->RequestShift->save($this->data);
				$this->set('url', $this->referer()); 
			} else {
				$this->set('errorField',$this->RequestShift->errorField);
				$this->set('errorMessage',$this->RequestShift->errorMessage);
			}
			$start = $this->data['RequestShift']['start'];
			$end = $this->data['RequestShift']['end'];
		} else {
			$start = str_replace("-",":",$start);
		}
		$this->set('request_area_id',$area_id);
		$day_id = ($day_id) ? $day_id : 1;
		$this->set('day_id',$day_id);
		$start = ($start) ? $start : '13:00:00';
		$end = ($end) ? $end : date("H:i:s",strtotime($start." + 1 hour"));
		$this->set('start',$start);
		$this->set('end',$end);
		$this->loadModel('Day');
		$this->Day->order = 'id';
		$this->set('days',$this->Day->sFind('list'));
	}
	
	function edit($id = null) {
		if (!empty($this->data)) {
			if ($this->RequestShift->valid($this->data)) {
				$this->RequestShift->save($this->data);
				$this->set('url', $this->referer()); 
			} else {
				$this->set('errorField',$this->RequestShift->errorField);
				$this->set('errorMessage',$this->RequestShift->errorMessage);
			}
		}
		if (empty($this->data)) {
			$this->data = $this->RequestShift->find('first',array(
				'recursive' => -1,
				'conditions' => array('RequestShift.id' => $id)
			));
		}
		$this->loadModel('Day');
		$this->Day->order = 'id';
		$this->set('days',$this->Day->sFind('list'));
	}
	
	function delete($id) {
		$this->RequestShift->delete($id);
		$this->redirect($this->referer());
	}

}
?>
