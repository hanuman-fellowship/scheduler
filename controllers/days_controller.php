<?php
class DaysController extends AppController {

	var $name = 'Days';

	function edit() {
		if (!empty($this->data)) {
			if ($this->Day->valid($this->data)) {
				$this->record();
				$description = $this->Day->sSave($this->data);
				$this->stop($description);
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->Day->errorField);
				$this->set('errorMessage',$this->Day->errorMessage);
			}
			foreach($this->data['Day'] as $key => $value) {
				if ($key == 'number') {
					$number = $value;
					unset($this->data['Day'][$key]);
					continue;
				}
				if ($key > $number) {
					unset($this->data['Day'][$key]);
				}
			}
			$this->set('days',$this->data['Day']);
		} else {
			$this->Day->recursive = -1;
			$this->Day->order = 'id';
			$this->set('days',$this->Day->sFind('list',array(
				'conditions' => array(
					'Day.name <>' => ''
				)
			)));
		}
	}
	
}	
?>
