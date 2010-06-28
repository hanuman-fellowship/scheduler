<?php
class PeopleController extends AppController {

	var $name = 'People';
	var $scaffold;
	var $helpers = array('schedule');
		
	/**
	 * Displays the schedule for the specified person.
	 * 
	 */
	function schedule($id = null) {	
		$this->set('person',$this->Person->getPerson($id));		
		$this->loadModel('Boundary');
		$this->set('bounds', $this->Boundary->getBounds());
	}	
	
	function add() {
		if (!empty($this->data)) {
			$this->Person->create();
			$this->record();
			$this->Person->sSave($this->data);
			$this->stop($this->Person->description);
			$this->redirect(array('controller' => 'people', 'action' => 'schedule', $this->Person->id));
		}
		$this->loadModel('ResidentCategory');
		$residentCategories = $this->ResidentCategory->sFind('list');
		$this->set(compact('residentCategories'));
	}
	
	function delete($id = null) {
		if ($id) {
//			$this->Person->sDelete($id);
		}
		$this->Person->sContain('ResidentCategory');
		$this->Person->order = 'Person.resident_category_id, Person.name';
		$this->set('people',$this->Person->sFind('all'));
	}
}
	
?>