<?php
class PeopleController extends AppController {

	var $name = 'People';
	var $helpers = array('schedule');
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
			$this->set('person',$this->Person->getPerson($id));		
			$this->loadModel('Boundary');
			$this->loadModel('Change');
			$this->set('changes', $this->Change->getChangesForMenu());
			$this->set('bounds', $this->Boundary->getBounds());
		} else {
			$this->redirect(array('action'=>'selectSchedule'));
		}
	}	

	function profile($id = null, $schedule_id = null) {
		if (!$id) {
			$this->redirect(array('action'=>'selectProfile'));
		}
		$file = glob(WWW_ROOT.'img'.DS.'photos'.DS.'profile'.DS.$id.'.*');
		$image = (isset($file[0])) ? 
			$id.strrchr($file[0],'.') : // get just the extension and append to filename (id))
			'no_image.jpg';
		$this->set('image',$image);
		if ($schedule_id) {
			$this->Person->schedule_id = $schedule_id;	
			$this->Person->ResidentCategory->schedule_id = $schedule_id;
		}
		$this->Person->sContain('ResidentCategory');
		$this->Person->id = $id;
		$this->set('person',$this->Person->find('first'));
	}
	
	function uploadImage($id = null) {
		if (!empty($this->data)) {
			$this->Attachment->upload($this->data['Profile'],$this->data['Profile']['id'],'profile');
			$this->redirect(array('action' => 'view',$this->data['Profile']['id']));
		}
		$this->set('id',$id);
	}

    function selectSchedule() {
		$this->Person->sContain('ResidentCategory');
		$this->Person->order = 'Person.resident_category_id, Person.name';	
		$this->set('people',$this->Person->sFind('all'));
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
				$this->stop($this->Person->description);
				if ($this->data['Person']['edit_profile']) {
					$this->set('url',
						array('action' => 'profile', $this->Person->Profile->id));
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
