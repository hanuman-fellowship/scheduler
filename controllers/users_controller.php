<?php
class UsersController extends AppController {

	var $name = 'Users';
	var $helpers = array('Html', 'Form');
		
    public function login() {
		if (empty($this->data)) {
			return;
		}

        $user = Authsome::login($this->data['User']);

        if (!$user) {
            $this->Session->setFlash('Unknown user or wrong password');
            return;
        }
       $this->redirect('/areas/schedule/1');
    }
    
    public function logout() {
    	if (Authsome::get()) {
			Authsome::logout();
			$this->Session->setFlash('You have been logged out');
		}
	 	$this->redirect($this->referer());
    }

	function index() {
		$this->User->recursive = 0;
		$this->set('users', $this->paginate());
	}

	function view($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid User', true));
			$this->redirect(array('action' => 'index'));
		}
		$this->set('user', $this->User->read(null, $id));
	}

	function add() {
		if (!empty($this->data)) {
			$this->User->create();
			if ($this->User->save($this->data)) {
				$this->Session->setFlash(__('The User has been saved', true));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The User could not be saved. Please, try again.', true));
			}
		}
		$groups = $this->User->Group->find('list');
		$this->set(compact('groups'));
	}

	function edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid User', true));
			$this->redirect(array('action' => 'index'));
		}
		if (!empty($this->data)) {
			if ($this->User->save($this->data)) {
				$this->Session->setFlash(__('The User has been saved', true));
				$this->redirect(array('action' => 'index'));
			} else {
				$this->Session->setFlash(__('The User could not be saved. Please, try again.', true));
			}
		}
		if (empty($this->data)) {
			$this->data = $this->User->read(null, $id);
		}
		$groups = $this->User->Group->find('list');
		$this->set(compact('groups'));
	}

	function delete($id = null) {
		if (!$id) {
			$this->Session->setFlash(__('Invalid id for User', true));
			$this->redirect(array('action' => 'index'));
		}
		if ($this->User->del($id)) {
			$this->Session->setFlash(__('User deleted', true));
			$this->redirect(array('action' => 'index'));
		}
		$this->Session->setFlash(__('The User could not be deleted. Please, try again.', true));
		$this->redirect(array('action' => 'index'));
	}

}
?>