<?php
class RequestAreasController extends AppController {

	var $name = 'RequestAreas';
	
	function publish($id) {
		$this->RequestArea->publish($id);
		
		// send email!!

		$this->redirect($this->referer());
	}

}
