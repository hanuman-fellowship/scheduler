<?php
class RequestAreasController extends AppController {

	var $name = 'RequestAreas';
	var $helpers = array('schedule');
	
	function edit($id = null,$force = false) {
		$this->redirectIfNotManager($id);
		$this->set('area',$this->RequestArea->edit($id,$force));
		$this->set('bounds', $this->getBounds());
	}

	// the id should be negative (the request area to be submited)
	function submit($id) {
		$this->redirectIfNotManager($id * -1);
		$this->RequestArea->submit($id);
		
		// send email!!

		$this->redirect($this->referer());
	}

	function view($id = null) {
		$this->redirectIfNot('operations');
		if (!$id) {
			$this->set('areas',$this->RequestArea->getList());
			$this->render('select');
		} else {
			$this->set('area',$this->RequestArea->view($id));
			$this->set('bounds', $this->getBounds());
		}
	}

	function redirectIfNotManager($id) {
		$areas = Set::combine(Authsome::get('Manager'),'{n}.id','{n}.area_id');
		if (!in_array($id,$areas)) {
			$this->redirect('/');
		}
	}

}
