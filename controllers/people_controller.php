<?php
class PeopleController extends AppController {

	var $name = 'People';
	var $helpers = array('Schedule');

	/**
	 * Displays the schedule for the specified person.
	 * 
	 */
	function schedule($id = null) {	
		if ($id) {
			$this->redirectIfNotValid($id);
			if ($id == 'gaps') {
				$person = $this->Person->getGaps();
			} else {
				$person = $this->Person->getPerson($id);
				$this->Person->addDisplayName($person['Person']);
				$this->Session->write('last_person',$id);
			}
			$this->set('person',$person);		
			$this->set('change_messages',$this->getChangeMessages());
			$this->set('bounds', $this->getBounds());
			if ($id == 'gaps') $this->render('gaps');
		} else {
			$this->redirect(array('action'=>'selectSchedule'));
		}
	}	

	function board() {
		$this->set('change_messages',$this->getChangeMessages());
		$this->set('people',$this->Person->getBoard());
	}

    function selectSchedule() {
		$this->set('people',$this->Person->listByResidentCategory());
	}

	/**
	*
	* Finds the latest version of each person and passes that to the view for selection
	*/
    function selectProfile() {
		$this->set('people',$this->Person->getPeople());
	}

	function add() {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->Person->valid($this->data)) {
				$this->Person->create();
				$this->record();
				$changes = $this->Person->sSave($this->data);
				$this->stop($this->Person->PeopleSchedules->description($changes));
				deleteCache('people');
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->Person->errorField);
				$this->set('errorMessage',$this->Person->errorMessage);
			}
		}
		$this->loadModel('ResidentCategory');
		$residentCategory = $this->ResidentCategory->sFind('list');
		$this->set(compact('residentCategory'));
	}
	
	function edit($id = null) {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->Person->valid($this->data)) {
				$this->record();
				$changes = $this->Person->sSave($this->data);
				$this->stop($this->Person->description($changes));
				$this->set('url', 
					array('controller' => 'people', 'action' => 'schedule', $this->data['Person']['id']));
			 } else {
				$this->set('errorField',$this->Person->errorField);
				$this->set('errorMessage',$this->Person->errorMessage);
			}
		}
		if (empty($this->data)) {
			$this->data = $this->Person->getPerson($id, true);
			$this->data['Person']['resident_category_id'] = 
				$this->data['PeopleSchedules']['resident_category_id'];
		}
		$this->loadModel('ResidentCategory');
		$residentCategory = $this->ResidentCategory->sFind('list');
		$this->set(compact('residentCategory'));
	}

	function retire($id = null) {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			$this->set('url', $this->referer());
			$this->record();
			$changes = $this->Person->retireMany($this->data);
			$this->stop($this->Person->description($changes));
			deleteCache('people');
			$this->Person->doQueue(); // perform the deletes so that the new cache is made correctly	
		}
		$this->set('people',$this->Person->listByResidentCategory());
	}

	function restore($id = null) {
		if ($id) {
			$this->record();
			$changes = $this->Person->restore($id);
			$this->stop($this->Person->description($changes));
			deleteCache('people');
			$this->redirect($this->loadPage());
		}
		$this->savePage();
		$this->set('people',$this->Person->getRestorable());
	}
}
	
?>
