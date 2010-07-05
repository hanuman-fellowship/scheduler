<?php
class ProfilesController extends AppController {

	var $name = 'Profiles';

	var $components = array(
		'Attachment' => array(
			'rm_tmp_file' => true,
			'allow_non_image_files' => false,
			'images_size' => array(
				'profile' => array(250,250,true),
			)
		)
	);

	function view($id = null) {
		$file = glob(WWW_ROOT.'img'.DS.'photos'.DS.'profile'.DS.$id.'.*');
		$image = (isset($file[0])) ? 
			$id.strrchr($file[0],'.') : // get just the extension and append to filename (id))
			'no_image.jpg';
		$this->set('image',$image);
	}

	function add() {
		if (!empty($this->data)) {
			if ($this->Profile->valid($this->data)) {
				$this->Profile->create();
				$this->Profile->save($this->data);
				$this->set('url', array('action' => 'view', $this->Profile->id));
				$this->Attachment->upload($this->data['Profile'],$this->Profile->id,'profile');
			} else {
				$this->set('errorField',$this->Profile->errorField);
				$this->set('errorMessage',$this->Profile->errorMessage);
			}
		}
	}

	function uploadImage($id = null) {
		if (!empty($this->data)) {
			$this->Attachment->upload($this->data['Profile'],$this->data['Profile']['id'],'profile');
			$this->redirect(array('action' => 'view',$this->data['Profile']['id']));
		}
		$this->set('id',$id);
	}
}
?>
