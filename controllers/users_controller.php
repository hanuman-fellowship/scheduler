<?php
class UsersController extends AppController {

	var $name = 'Users';
	var $components = array('Email');
		
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
			$this->loadModel('Schedule');
			if ($this->Schedule->field('name',array('id' => $autoSelect)) != 'Published') {
				$this->setSchedule($autoSelect);
			} else {
				$this->User->Setting->deleteAll(array(
					'Setting.key' => 'auto_select',
					'Setting.user_id' => Authsome::get('id')
				),false,false);
			}
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
				$this->loadModel('EmailAuth');
				if (!$this->EmailAuth->field('email',array('id' => 1))) {
				  $this->redirect(array('controller' => 'emailAuths', 'action' => 'noEmail','Operations'));
				}
				$auth = $this->EmailAuth->findById(1);
				$this->User->create();
				$this->data['User']['password'] = $this->_randomPassword();
				$this->User->sSave($this->data);
				$this->_sendEmail($this->data['User']['email'], 'Your New Account in the Scheduler', 'new_user', array(
					'username' => Inflector::humanize($this->data['User']['username']),
					'password' => $this->data['User']['password'],
					'operationsEmail' => $auth['EmailAuth']['email'],
					'operationsName' => $auth['EmailAuth']['name']
				));
				$this->render('added');
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

	function _randomPassword($length = 4) {
		$password = "";
		$possible = "0123456789bcdfghjkmnpqrstvwxyz"; 
		$i = 0; 
		while ($i < $length) { 
			$char = substr($possible, mt_rand(0, strlen($possible)-1), 1);
			if (!strstr($password, $char)) { 
				$password .= $char;
				$i++;
			}
		}
		return $password;
	}

	function resetPassword() {
		if (!empty($this->data)) {
			$this->User->recursive = -1;
			if ($user = $this->User->findByEmail($this->data['User']['email'])) {
				$this->loadModel('EmailAuth');
				if (!$this->EmailAuth->field('email',array('id' => 1))) {
				  $this->redirect(array('controller' => 'emailAuths', 'action' => 'noEmail','Operations'));
				}
				$auth = $this->EmailAuth->findById(1);
				$userEmail = $user['User']['email'];
				$username = Inflector::humanize($user['User']['username']);

				$password = $this->_randomPassword();
	
				$this->User->save(array(
					'id' => $user['User']['id'],
					'password' => Authsome::hash($password)
				));
			
				$this->_sendEmail($userEmail, 'Password Request', 'reset_password', array(
					'username' => $username,
					'password' => $password,
					'operationsEmail' => $auth['EmailAuth']['email'],
					'operationsName' => $auth['EmailAuth']['name']
				));
				$this->set('flash','Please check your email');
			} else {
				$this->set('errorMessage','Email not recognized');
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

	function emailUsers() {
		$this->redirectIfNot('operations');
		$this->loadModel('EmailAuth');
		if (!$this->EmailAuth->field('email',array('id' => 1))) {
		  $this->redirect(array('controller' => 'emailAuths', 'action' => 'noEmail','Operations'));
		}
		$auth = $this->EmailAuth->findById(1);
		if (!empty($this->data)) {
			$E = $this->data['User'];
			if (!$E['to']) {
				$this->set('errorMessage','This is not a journal entry. Who are we sending this to?');
			} elseif (!$this->_sendEmail(
				$E['to'],
				$E['subject'],
				null,
				$E['message'],
				"{$auth['EmailAuth']['name']} <{$auth['EmailAuth']['email']}>",
				$auth['EmailAuth']['email'],
				$auth['EmailAuth']['password']
			)) {
				if (substr($this->Email->smtpError,0,3) == '535') {
					$error = "SMTP Error: Bad Username/Password";
				} else {
					$error = $this->Email->smtpError;
				}
				$this->set('errorMessage',$error);
			} else {
				$this->render('sent');
			}
		}
		$this->User->order = 'username';
		$this->set('users',
			Set::combine(
				array_values($this->User->find('all')),
				'{n}.User.email',
				'{n}.User.username'
			)
		);
		$this->set('operationsEmail',$auth['EmailAuth']['email']);
		$this->set('operationsName',$auth['EmailAuth']['name']);
	}

	function notes() {
		if(!Authsome::get('id')) $this->redirect('/');
		$this->set('change_messages',$this->getChangeMessages());
		if(!empty($this->data)) {
			$this->savePage();
			$this->User->save($this->data);
		} else {
			$this->data = $this->User->findById(Authsome::get('id'));
		}
	}

}
?>
