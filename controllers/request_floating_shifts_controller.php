<?php
class RequestFloatingShiftsController extends AppController {

	var $name = 'RequestFloatingShifts';
	
	function add($area_id = null, $person_id = null) {
		if (!empty($this->data)) {
			if ($this->RequestFloatingShift->valid($this->data)) {
				$this->RequestFloatingShift->create();
				$this->record();
				$this->RequestFloatingShift->save($this->data);
				$this->set('url',$this->loadPage() );
			} else {
				$this->set('errorField',$this->RequestFloatingShift->errorField);
				$this->set('errorMessage',$this->RequestFloatingShift->errorMessage);
			}
		}
		$this->savePage();
		$this->set('request_area_id',$area_id);
		$this->loadModel('Person');
		$this->set('people',$this->Person->getList());
		$this->set('person_id',$person_id);
	}

	function edit($id = null) {
		if (!empty($this->data)) {
			if ($this->RequestFloatingShift->valid($this->data)) {
				$this->RequestFloatingShift->save($this->data);
				$this->set('url',$this->loadPage() );
			} else {
				$this->set('errorField',$this->RequestFloatingShift->errorField);
				$this->set('errorMessage',$this->RequestFloatingShift->errorMessage);
			}
		}
		if (empty($this->data)) {
			$this->data = $this->RequestFloatingShift->find('first',array(
				'recursive' => -1,
				'conditions' => array('RequestFloatingShift.id' => $id)
			));
		}
		$this->savePage();
		$this->loadModel('Area');
		$this->Area->order = 'name';
		$areas = $this->Area->sFind('list');
		$areas[0] = '';
		$this->loadModel('Person');
		$this->set('people',$this->Person->getList());
	}
	
	function delete($id) {
		$this->RequestFloatingShift->delete($id);
		$this->redirect($this->referer());
	}
		

}
