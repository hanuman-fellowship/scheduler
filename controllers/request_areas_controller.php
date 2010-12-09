<?php
class RequestAreasController extends AppController {

	var $name = 'RequestAreas';
	var $helpers = array('schedule');
	var $components = array('Email');
	
	function edit($id = null,$force = false) {
		$this->redirectIfNotManager($id);
		$this->set('area',$this->RequestArea->edit($id,$force));
		$this->set('bounds', $this->getBounds());
	}

	function editNotes($id = null) {
		if (!empty($this->data)) {
			$this->record();
			$this->RequestArea->save($this->data);
			$this->set('url',$this->referer());
		} else {
			$this->RequestArea->recursive = -1;
			$this->data = $this->RequestArea->find('first',array(
				'conditions' => array(
					'RequestArea.id' => $id
				)
			));
		}
	}

	// the id should be negative (the request area to be submited)
	function submit($id) {
		$this->redirectIfNotManager($id * -1);
		$this->RequestArea->submit($id);

		$areaName = $this->RequestArea->field('name',array('RequestArea.id' => $id));
		$userEmail = Authsome::get('User.email');
		$username = Inflector::humanize(Authsome::get('User.username'));
		$message =  "Hello, {$username},\n";
		$message .= "\n";
		$message .= "Thank you for submiting the {$areaName} Request Form.";
		$message .= " Operations has been notified, and will contact you if there are any questions.";
		$message .= " Feel free to update your request and re-submit it at any time, but please";
		$message .= " don't be too late! :)\n";
		$message .= "\n";
		$message .= "You are welcome to contact operations at operations@mountmadonna.org with any questions.\n";
		$message .= "\n";
		$message .= "Thanks,\n";
		$message .= "Operations Team";
		
		$this->Email->from    = 'Scheduler at MMC <do-not-reply@mountmadonna.org>';
		$this->Email->to      = $userEmail;
		$this->Email->subject = 'Area Request Form Recieved!';
		$this->Email->send($message);

		$this->Email->reset();
		$this->Email->from    = 'Scheduler at MMC <do-not-reply@mountmadonna.org>';
		$this->Email->to      = 'shantam@mountmadonna.org';
		$this->Email->subject = "{$areaName} Request Form Submitted";
		$message =  "Hello Operations Team,\n";
		$message .= "\n";
		$message .= "{$username} has submitted the {$areaName} Request form, and it is avaialable";
		$message .= " for viewing in the Scheduler. {$username} can be contacted at {$userEmail}.\n";
		$message .= "\n";
		$message .= "Automatically Yours,\n";
		$message .= "The Scheduler";
		$this->Email->send($message);

		$this->redirect(array('controller'=>'requestAreas','action'=>'edit',$id*-1));
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

}
