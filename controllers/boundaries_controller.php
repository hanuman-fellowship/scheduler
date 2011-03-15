<?php
class BoundariesController extends AppController {

	var $name = 'Boundaries';

	function edit() {
		if (!empty($this->data)) {
			if ($this->Boundary->valid($this->data)) {
				$this->record();
				$this->Boundary->sSave($this->data);
				$this->stop('Times changed');
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->Boundary->errorField);
				$this->set('errorMessage',$this->Boundary->errorMessage);
			}
		}
		$this->set('bounds', $this->Boundary->getBounds());
	}

}
?>
