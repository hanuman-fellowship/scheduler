<?php
class PeopleController extends AppController {

	var $name = 'People';
	var $helpers = array('Schedule');
  var $components = array('Uploadify', 'Image');

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
				$this->Session->write('last_person',$id);
			}
			if (!isset($this->params['requested'])) {
				$this->set('change_messages',$this->getChangeMessages());
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

  function profile($id) {
    $this->set('person', $this->Person->getPerson($id));
    $this->set('times_here', $this->Person->timesHere($id));
    $this->set('change_messages',$this->getChangeMessages());
  }

	function add() {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->Person->valid($this->data)) {
				$this->record();
				$this->Person->create();
				$description = $this->Person->sSave($this->data);
				$this->stop($description);
				$this->set('url', array('controller'=>'people','action'=>'schedule',$this->Person->id));
			} else {
				$this->set('errorField',$this->Person->errorField);
				$this->set('errorMessage',$this->Person->errorMessage);
			}
		}
		$this->loadModel('ResidentCategory');
		$residentCategory = $this->ResidentCategory->sFind('list');
		$this->set(compact('residentCategory'));
	}
	
	function category($id = null) {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->Person->PeopleSchedules->valid($this->data)) {
				$this->record();
				$description = $this->Person->PeopleSchedules->sSave($this->data);
				$this->stop($description);
				$this->set('url', $this->referer());
			 } else {
				$this->set('errorField',$this->Person->PeopleSchedules->errorField);
				$this->set('errorMessage',$this->Person->PeopleSchedules->errorMessage);
			}
		}
		if (empty($this->data)) {
			$this->data = $this->Person->PeopleSchedules->sFind('first',array(
				'conditions' => array('person_id' => $id),
				'recursive' => -1
			));
		}
		$residentCategory = $this->Person->PeopleSchedules->ResidentCategory->sFind('list');
		$this->set(compact('residentCategory'));
	}

	function edit($id = null) {
		$this->redirectIfNot('operations');
		if (!empty($this->data)) {
			if ($this->Person->valid($this->data)) {
				$this->Person->sSave($this->data);
				$this->set('url', 
					array('controller' => 'people', 'action' => 'schedule', $this->data['Person']['id']));
			 } else {
				$this->set('errorField',$this->Person->errorField);
				$this->set('errorMessage',$this->Person->errorMessage);
			}
		}
		if (empty($this->data)) {
			$this->data = $this->Person->getPerson($id, true);
		}
	}

	function editNotes($id = null) {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			$this->record();
			$description = $this->Person->PeopleSchedules->sSave($this->data);
			$this->stop($description);
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
			$description = $this->Person->retireMany($this->data);
			$this->stop($description);
			deleteCache('people');
			$this->Person->doQueue(); // perform the deletes so that the new cache is made correctly	
		}
		$this->set('people',$this->Person->listByResidentCategory());
	}

	function restore($id = null, $category = null) {
		if ($id) {
			if ($category) {
				$this->record();
				$description = $this->Person->restore($id, $category);
				$this->stop($description);
				$this->redirect($this->loadPage());
			}
			$this->set('id', $id);
			$this->Person->PeopleSchedules->ResidentCategory->order = array('sort_order asc');
			$this->set('categories',$this->Person->PeopleSchedules->ResidentCategory->sFind('list'));
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

	function upload($id) {
    $this->log('hello');
		$image = $this->Uploadify->upload();
    $this->Image->resize("img/people/{$image}","img/people/{$id}", 150);
    unlink("img/people/{$image}");
		echo $image;
		$this->autoRender = false;
	}

}
	
?>
