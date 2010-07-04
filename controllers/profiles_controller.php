<?php
class ProfilesController extends AppController {

	var $name = 'Profiles';

	var $components = array(
		'Attachment' => array(
			'rm_tmp_file' => true,
			'allow_non_image_files' => false,
			'images_size' => array(
				'images' => array(250,250,true),
				'thumbs' => array(75,75,true)
			)
		)
	);

	function view($id = null) {

	}

	function add() {
		if (!empty($this->data)) {
//			if ($this->Area->valid($this->data)) {
//				$this->Area->create();
//				$this->record();
				$this->Profile->save($this->data);
//				$this->stop($this->Area->description);
//				$this->set('url', array('controller' => 'areas', 'action' => 'schedule', $this->Area->id));
//			} else {
//				$this->set('errorField',$this->Area->errorField);
//				$this->set('errorMessage',$this->Area->errorMessage);
//			}
			$this->Attachment->upload($this->data['Profile']);
		}
	}
}
?>
