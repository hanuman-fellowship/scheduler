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
				if (!isset($this->params['requested'])) {
					$this->set('change_messages',$this->getChangeMessages());
					$this->Session->write('last_person',$id);
					$this->Person->PersonnelNote->order = 'PersonnelNote.order asc';
					$personnelNotes = $this->Person->PersonnelNote->findAllByPersonId($id);
					$this->set('personnelNotes', Set::combine(
						$personnelNotes,'{n}.PersonnelNote.id','{n}.PersonnelNote.note'));
					$this->Person->OperationsNote->order = 'OperationsNote.order asc';
					$personnelNotes = $this->Person->OperationsNote->findAllByPersonId($id);
					$this->set('operationsNotes', Set::combine(
					$personnelNotes,'{n}.OperationsNote.id','{n}.OperationsNote.note'));
				} else {
					$this->set('print',true);
				}
			}
			$this->set('person',$person);		
			$this->set('bounds', $this->getBounds());
			if ($id == 'gaps') $this->render('gaps');
		} else {
			$this->redirect(array('action'=>'selectSchedule'));
		}
	}	

	function board() {
		$this->set('change_messages',$this->getChangeMessages());
		$this->set('bounds', $this->getBounds());
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

	function editNotes($id = null) {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			$this->record();
			$changes = $this->Person->PeopleSchedules->sSave($this->data);
			$this->stop($this->Person->PeopleSchedules->description($changes));
			$this->set('url',$this->referer());
		} else {
			$this->data = $this->Person->PeopleSchedules->sFind('first',array(
				'conditions' => array('PeopleSchedules.person_id' => $id)));
		}
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

	function previous($id) {
		$people = $this->Person->listByResidentCategory(true);
		while(list($key, $val) = each($people)) {
			if ($key == $id) {
				prev($people);
				prev($people);
				$goto = each($people);
				$this->redirect(array('action'=>'schedule',$goto['key']));
			}
		}
	}

	function next($id) {
		$people = $this->Person->listByResidentCategory(true);
		while(list($key, $val) = each($people)) {
			if ($key == $id) {
				$goto = each($people);
				$this->redirect(array('action'=>'schedule',$goto['key']));
			}
		}
	}

	function printm($id = null) {
		$output = '';
		if (!empty($this->data)) {
			foreach($this->data['Person'] as $category) {
				if (is_array($category)) {
					foreach($category as $id) {
						$output .= $this->requestAction(
							array('controller'=>'people','action'=>'schedule'),
							array('pass'=>array($id),'return')
						);
					}
				}
			}
			$this->set('output',$output);
			$this->set('back',$this->referer());
		} else {
			$this->set('people',$this->Person->listByResidentCategory());
			$this->data['Person']['person_id'] = array($id);
			$this->render('select_print');
		}	
	}

	function changed() {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if (isset($this->data['Person']['since'])) {
				if ($this->data['Person']['since'] != '' &&
				!strtotime($this->data['Person']['since'])) {
					$this->set('errorMessage',"Don't understand that time");
					$this->set('errorField','since');
				} else {
					$since = strtotime($this->data['Person']['since']);
					$this->set('changed',$this->Person->getChanged($since));
					$this->set('people',$this->Person->listByResidentCategory());
				}
			}
		}	
	}

}
	
?>
