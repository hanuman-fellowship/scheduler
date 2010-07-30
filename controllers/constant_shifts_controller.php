<?php
class ConstantShiftsController extends AppController {

	var $name = 'ConstantShifts';

	function add() {
		if (!empty($this->data)) {
			if ($this->ConstantShift->valid($this->data)) {
				$this->ConstantShift->create();
				$this->record();
				$this->ConstantShift->sSave($this->data);
				$this->stop($this->ConstantShift->description);
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->ConstantShift->errorField);
				$this->set('errorMessage',$this->ConstantShift->errorMessage);
				$start = $this->data['ConstantShift']['start'];
				$end = $this->data['ConstantShift']['end'];
			}
		}
		$start = isset($start) ? $start : '13:00:00';
		$end = isset($end) ? $end : date("H:i:s",strtotime($start." + 1 hour"));
		$this->set('start',$start);
		$this->set('end',$end);
		$this->loadModel('ResidentCategory');
		$this->ResidentCategory->order = 'id';
		$this->set('residentCategories',$this->ResidentCategory->sFind('list'));
		$this->loadModel('Day');
		$this->Day->order = 'id';
		$this->set('days',$this->Day->sFind('list'));
	}

}
?>
