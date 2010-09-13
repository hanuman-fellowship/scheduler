<?php
class RequestAreasController extends AppController {

	var $name = 'RequestAreas';
	var $helpers = array('schedule');
	
	function edit($id = null) {
		$this->redirectIfNotManager($id);
		$this->set('area',$this->RequestArea->edit($id));
		$this->set('bounds', $this->getBounds());
	}

	// the id should be negative (the request area to be published)
	function publish($id) {
		$this->redirectIfNotManager($id * -1);
		$this->RequestArea->publish($id);
		
		// send email!!

		$this->redirect($this->referer());
	}

	function view($id = null) {
		
	}

	function redirectIfNotManager($id) {
		$areas = Set::combine(Authsome::get('Manager'),'{n}.id','{n}.area_id');
		if (!in_array($id,$areas)) {
			$this->redirect('/');
		}
	}

}
