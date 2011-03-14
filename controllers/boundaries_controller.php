<?php
class BoundariesController extends AppController {

	var $name = 'Boundaries';

	function edit() {
		if (!empty($this->data)) {
			if ($this->Boundary->valid($this->data)) {
			//	$this->record();
		//		$description = $this->Boundary->sSave($this->data);
			//	$this->stop($description);
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->Boundary->errorField);
				$this->set('errorMessage',$this->Boundary->errorMessage);
			}
		}
		$this->Boundary->sContain('Day','Slot');
		$this->Boundary->order = 'Day.id asc, Slot.id asc';
		$this->set('bounds', $this->getBounds());
	}

}
?>
