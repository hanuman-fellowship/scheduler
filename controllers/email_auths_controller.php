<?php
class EmailAuthsController extends AppController {

	var $name = 'EmailAuths';

	function operations() {
		$this->redirectIfNot('operations');
		if (!empty($this->data)) {
			if ($this->EmailAuth->valid($this->data)) {
				$this->EmailAuth->save($this->data);
				$this->set('url',$this->referer());
			 } else {
				$this->set('errorField',$this->EmailAuth->errorField);
				$this->set('errorMessage',$this->EmailAuth->errorMessage);
			}
		} else {
			$this->data = $this->EmailAuth->findById(1);
		}
	}

	function scheduler() {
		$this->redirectIfNot('operations');
		if (!empty($this->data)) {
			if ($this->EmailAuth->valid($this->data)) {
				$this->EmailAuth->save($this->data);
				$this->set('url',$this->referer());
			 } else {
				$this->set('errorField',$this->EmailAuth->errorField);
				$this->set('errorMessage',$this->EmailAuth->errorMessage);
			}
		} else {
			$this->data = $this->EmailAuth->findById(2);
		}
	}

}
?>
