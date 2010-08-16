<?php
class PeopleController extends AppController {

	var $name = 'People';
	var $helpers = array('schedule');
	var $paginate = array(
		'limit' => 25,
		'order' => 'Person.name'
	);
	var $components = array(
		'Attachment' => array(
			'rm_tmp_file' => true,
			'allow_non_image_files' => false,
			'images_size' => array(
				'icon' => array(75,75,true),
				'profile' => array(250,250,true),
				'big' => array(500,500,true),
			)
		)
	);

	/**
	 * Displays the schedule for the specified person.
	 * 
	 */
	function schedule($id = null) {	
		if ($id) {
			$this->redirectIfNotValid($id);
			$person = $this->Person->getPerson($id);
			$this->Person->addDisplayName($person['Person']);
			$this->set('person',$person);		
//			$this->set('changes', $this->Change->getChangesForMenu());
			$this->set('bounds', $this->getBounds());
			$this->Session->write('last_person',$id);
		} else {
			$this->redirect(array('action'=>'selectSchedule'));
		}
	}	

	function profile($id = null) {
		if (!$id) {
			$this->redirect(array('action'=>'selectProfile'));
		}
		$this->redirectIfNotValid($id);
		$file = glob(WWW_ROOT.'img'.DS.'photos'.DS.'profile'.DS.$id.'.*');
		$image = (isset($file[0])) ? 
			$id.strrchr($file[0],'.') : // get just the extension and append to filename (id))
			'no_image.jpg';
		$this->set('image',$image);
		$this->set('person',$this->Person->getPerson($id, true));
		$this->loadModel('Change');
		$this->set('changes', $this->Change->getChangesForMenu());
	}
	
	function uploadImage($id = null) {
		if (!empty($this->data)) {
			$this->Attachment->upload($this->data['Person'],$this->data['Person']['id'],'person');
			$this->redirect($this->loadPage());
		}
		$this->savePage();
		$this->set('id',$id);
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
		if (!empty($this->data)) {
			if ($this->Person->valid($this->data)) {
				$this->Person->create();
				$this->record();
				$this->Person->sSave($this->data);
				$this->stop($this->Person->PeopleSchedules->description);
				$this->Session->delete('cache.people');
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
		if (!empty($this->data)) {
			if ($this->Person->valid($this->data)) {
				$this->record();
				$this->Person->sSave($this->data);
				$this->stop($this->Person->description);
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
		if ($id) {
			$this->record();
			$this->Person->retire($id);
			$this->stop($this->Person->description);
			$this->Session->delete('cache.people');
			$this->redirect($this->loadPage());
		}
		$this->savePage();
		$this->set('people',$this->Person->listByResidentCategory());
	}

	function restore($id = null) {
		if ($id) {
			$this->record();
			$this->Person->restore($id);
			$this->stop($this->Person->description);
			$this->Session->delete('cache.people');
			$this->redirect($this->loadPage());
		}
		$this->savePage();
		$this->set('people',$this->Person->getRestorable());
	}
}
	
?>
