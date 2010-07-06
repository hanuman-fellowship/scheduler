<?php
class PeopleController extends AppController {

	var $name = 'People';
	var $helpers = array('schedule');
		
	/**
	 * Displays the schedule for the specified person.
	 * 
	 */
	function schedule($id = null) {	
		if ($id) {
			$this->set('person',$this->Person->getPerson($id));		
			$this->loadModel('Boundary');
			$this->loadModel('Change');
			$this->set('changes', $this->Change->getChangesForMenu());
			$this->set('bounds', $this->Boundary->getBounds());
		} else {
			$this->redirect(array('action'=>'select'));
		}
	}	

    function select() {
		$this->Person->sContain('ResidentCategory');
		$this->Person->order = 'Person.resident_category_id, Person.name';	
		$this->set('people',$this->Person->sFind('all'));
	}

	function add() {
		if (!empty($this->data)) {
			if ($this->Person->valid($this->data)) {
				$this->Person->create();
				$this->record();
				$this->Person->sSave($this->data);
				$this->stop($this->Person->description);
				if ($this->data['Person']['edit_profile']) {
					$this->set('url',
						array('controller' => 'profiles', 'action' => 'view', $this->Person->Profile->id));
				} else {
					$this->set('url', 
						array('action' => 'schedule', $this->Person->id));
				}
			} else {
				$this->set('errorField',$this->Person->errorField);
				$this->set('errorMessage',$this->Person->errorMessage);
			}
		}
		$this->loadModel('ResidentCategory');
		$residentCategories = $this->ResidentCategory->sFind('list');
		$this->set(compact('residentCategories'));
	}
	
	function edit($id = null) {
		if (!empty($this->data)) {
			if ($this->Person->valid($this->data)) {
				$this->record();
				$this->Person->sSave($this->data);
				$this->stop($this->Person->description);
				$this->set('url', array('controller' => 'people', 'action' => 'schedule', $this->data['Person']['id']));
			 } else {
				$this->set('errorField',$this->Person->errorField);
				$this->set('errorMessage',$this->Person->errorMessage);
			}
		}
		if (empty($this->data)) {
			$this->id = $id;
			$this->data = $this->Person->sFind('first');
		}
		$this->loadModel('ResidentCategory');
		$residentCategories = $this->ResidentCategory->sFind('list');
		$this->set(compact('residentCategories'));
	}

	function delete($id = null) {
		if ($id) {
			$this->record();
			$this->Person->sDelete($id);
			$this->stop($this->Person->description);
			$this->redirect($this->loadPage());
		}
		$this->savePage();
		$this->Person->sContain('ResidentCategory');
		$this->Person->order = 'Person.resident_category_id, Person.name';
		$this->set('people',$this->Person->sFind('all'));
	}
}
	
?>
