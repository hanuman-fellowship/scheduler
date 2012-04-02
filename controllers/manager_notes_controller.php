<?php
class ManagerNotesController extends AppController {

	var $name = 'ManagerNotes';
	
	function edit($area_id = 0) { // for operations
		$this->redirectIfNot('operations');
		if ($area_id == -1) { // select area
			$this->ManagerNote->Area->recursive = -1;
			$this->ManagerNote->Area->order = 'name';
			$areas = $this->ManagerNote->Area->sFind('list');
			$this->set('areas', $areas);
			$this->render('select');
		} else {
			$this->set('change_messages',$this->getChangeMessages());
			$area = $this->ManagerNote->Area->sFind('first', array('conditions' => array(
				'Area.id' => $area_id
			)));
			$area_name = $area? $area['Area']['name'] : 'All Areas';
			if(!empty($this->data)) {
				$this->ManagerNote->save($this->data);
				$this->redirect($this->referer());
			} else {
				$this->data = $this->ManagerNote->findByAreaId($area_id);
			}
			$this->set('area_id', $area_id);
			$this->set('area_name', $area_name);
		}
	}

	function view() { // for managers
		$this->redirectIfNot('manager');
		$managerAreas = $this->_managerAreas();
		$notes = array('All Managers' => $this->ManagerNote->field('note', array('ManagerNote.area_id' => 0)));
		foreach($managerAreas as $areaId => $areaName) {
			$notes[$areaName] = $this->ManagerNote->field('note', array('ManagerNote.area_id' => $areaId));
		}
		$this->set('notes', $notes);
	}

}
?>
