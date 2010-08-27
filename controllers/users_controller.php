<?php
class UsersController extends AppController {

	var $name = 'Users';
		
    public function login() {
		if (empty($this->data)) {
			return;
		}

        $user = Authsome::login($this->data['User']);

        if (!$user) {
			$this->set('errorField','username');
			$this->set('errorMessage','Unknown user or wrong password');
            return;
        }
		if ($autoSelect = $this->loadSetting('auto_select')) {
			$this->setSchedule($autoSelect);
		}
		$this->set('url', $this->referer());
    }
    
    public function logout() {
    	if (Authsome::get()) {
			Authsome::logout();
			$this->setSchedule('latest');
		}
	 	$this->redirect($this->referer());
    }

	function add() {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->User->valid($this->data)) {
				$this->User->create();
				$this->User->save($this->data);
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->User->errorField);
				$this->set('errorMessage',$this->User->errorMessage);
			}
		}
	}

	function changePassword() {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->User->changePassword($this->data)) {
				$this->set('url',$this->referer());
			} else {
				$this->set('errorField',$this->User->errorField);
				$this->set('errorMessage',$this->User->errorMessage);
			}
		}
	}

	function delete($id = null) {
		$this->redirectIfNotEditable();
		if ($id) {
			$this->User->delete($id);
			$this->redirect($this->referer());
		}
		$this->User->recursive = -1;
		$this->User->order = 'username';
		$this->set('users',$this->User->find('all',array(
			'conditions' => array(
				'User.id <>' => Authsome::get('id')
			)
		)));
	}
	
}
?>
