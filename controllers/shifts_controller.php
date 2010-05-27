<?php
class ShiftsController extends AppController {

	var $name = 'Shifts';
	var $helpers = array('Html', 'Form');

	function index() {
		$this->Shift->recursive = 0;
		$this->set('shifts', $this->paginate());
	}

	function view($id = null) {
		if (!$id) {
			$this->flash(__('Invalid Shift', true), array('action' => 'index'));
		}
		$this->set('shift', $this->Shift->read(null, $id));
	}

	function add() {
		if (!empty($this->data)) {
			$this->Shift->create();
			if ($this->Shift->save($this->data)) {
				$this->flash(__('Shift saved.', true), array('action' => 'index'));
			} else {
			}
		}
		$people = $this->Shift->Person->find('list');
		$areas = $this->Shift->Area->find('list');
		$this->set(compact('people', 'areas'));
	}

	function edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->flash(__('Invalid Shift', true), array('action' => 'index'));
		}
		if (!empty($this->data)) {
			if ($this->Shift->save($this->data)) {
				$this->flash(__('The Shift has been saved.', true), array('action' => 'index'));
			} else {
			}
		}
		if (empty($this->data)) {
			$this->data = $this->Shift->read(null, $id);
		}
		$people = $this->Shift->Person->find('list');
		$areas = $this->Shift->Area->find('list');
		$this->set(compact('people','areas'));
	}

	function delete($id = null) {
		if (!$id) {
			$this->flash(__('Invalid Shift', true), array('action' => 'index'));
		}
		if ($this->Shift->del($id)) {
			$this->flash(__('Shift deleted', true), array('action' => 'index'));
		}
		$this->flash(__('The Shift could not be deleted. Please, try again.', true), array('action' => 'index'));
	}

}
?>