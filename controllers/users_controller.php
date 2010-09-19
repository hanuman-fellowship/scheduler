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
		$this->redirectIfNot('operations');
		if (!empty($this->data)) {
			if ($this->User->valid($this->data)) {
				$this->User->create();
				$this->User->sSave($this->data);
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->User->errorField);
				$this->set('errorMessage',$this->User->errorMessage);
			}
		}
		$this->loadModel('Area');
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
	}

	function changePassword() {
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
		$this->redirectIfNot('operations');
		if ($id) {
			$this->User->sDelete($id,true);
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
	
	function edit($id = null) {
		$this->redirectIfNot('operations');
		if(!$id && !$this->data) {
			$this->User->order = 'username';
			$this->set('users',$this->User->find('list'));
			$this->render('select_edit');
		} elseif (!$this->data) {
			$this->data = $this->User->edit($id);
		}
		if (!empty($this->data) && !isset($this->data['Role'])) {
			if ($this->User->valid($this->data)) {
				if ($this->data['User']['id'] == Authsome::get('id')) {
					$this->data['User']['operations'] = true;
				}
				$this->User->sSave($this->data);
				$this->set('url', $this->referer());
				Authsome::login('update'); // in case user is editing themself
			} else {
				$this->set('errorField',$this->User->errorField);
				$this->set('errorMessage',$this->User->errorMessage);
			}
		}
		$this->loadModel('Area');
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
	}
}
?>
