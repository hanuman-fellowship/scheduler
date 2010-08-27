<?php
class FloatingShiftsController extends AppController {

	var $name = 'FloatingShifts';

	function add($area_id = null, $person_id = null) {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->FloatingShift->valid($this->data)) {
				$this->FloatingShift->create();
				$this->record();
				$this->FloatingShift->sSave($this->data);
				$this->stop($this->FloatingShift->description);
				$this->set('url',$this->loadPage() );
			} else {
				$this->set('errorField',$this->FloatingShift->errorField);
				$this->set('errorMessage',$this->FloatingShift->errorMessage);
			}
		}
		$this->savePage();
		$this->loadModel('Area');
		$this->Area->order = 'name';
		$areas = $this->Area->sFind('list');
		$areas[0] = '';
		$this->set('areas',$areas);
		$this->set('area_id',$area_id);
		$this->loadModel('Person');
		$this->set('people',$this->Person->getList());
		$this->set('person_id',$person_id);
	}

	function edit($id = null) {
		$this->redirectIfNotEditable();
		if (!$id && empty($this->data)) {
			$this->redirect(array('action' => 'index'));
		}
		if (!empty($this->data)) {
			if ($this->FloatingShift->valid($this->data)) {
				$this->record();
				$this->FloatingShift->sSave($this->data);
				$this->stop($this->FloatingShift->description);
				$this->set('url',$this->loadPage() );
			} else {
				$this->set('errorField',$this->FloatingShift->errorField);
				$this->set('errorMessage',$this->FloatingShift->errorMessage);
			}
		}
		if (empty($this->data)) {
			$this->id = $id;
			$this->data = $this->FloatingShift->sFind('first');
		}
		$this->savePage();
		$this->loadModel('Area');
		$this->Area->order = 'name';
		$areas = $this->Area->sFind('list');
		$areas[0] = '';
		$this->set('areas',$areas);
		$this->loadModel('Person');
		$this->set('people',$this->Person->getList());
	}
	
	function delete($id) {
		$this->redirectIfNotEditable();
		$this->record();
		$this->FloatingShift->sDelete($id);
		$this->stop($this->FloatingShift->description);
		$this->redirect($this->referer());
	}
		
}
?>
