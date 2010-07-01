<?php
class ShiftsController extends AppController {

	var $name = 'Shifts';

	function add($area_id = null,$day_id = null, $start = null, $end = null) {
		if (!empty($this->data)) {
			if ($this->Shift->valid($this->data)) {
				$this->Shift->create();
				$this->record();
				$this->Shift->sSave($this->data);
				$this->stop($this->Shift->description);
				$this->set('url', array('controller' => 'areas', 'action' => 'schedule', $this->data['Shift']['area_id']));
			} else {
				$this->set('errorField',$this->Shift->errorField);
				$this->set('errorMessage',$this->Shift->errorMessage);
				$start = $this->data['Shift']['start'];
				$end = $this->data['Shift']['end'];
			}
		} else {
			$start = str_replace("-",":",$start);
		}
		$this->loadModel('Area');
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
		$this->set('area_id',$area_id);
		$day_id = ($day_id) ? $day_id : 1;
		$this->set('day_id',$day_id);
		$start = ($start) ? $start : '13:00:00';
		$end = ($end) ? $end : date("H:i:s",strtotime($start." + 1 hour"));
		$this->set('start',$start);
		$this->set('end',$end);
		$this->loadModel('Day');
		$this->Day->order = 'id';
		$this->set('days',$this->Day->sFind('list'));
	}
	
	function edit($id = null) {
		if (!$id && empty($this->data)) {
			$this->Session->setFlash(__('Invalid Shift', true));
			$this->redirect(array('action' => 'index'));
		}
		if (!empty($this->data)) {
			if ($this->Shift->valid($this->data)) {
				$this->record();
				$this->Shift->sSave($this->data);
				$this->stop($this->Shift->description);
				$this->set('url', array('controller' => 'areas', 'action' => 'schedule', $this->data['Shift']['area_id']));
			} else {
				$this->set('errorField',$this->Shift->errorField);
				$this->set('errorMessage',$this->Shift->errorMessage);
			}
		}
		if (empty($this->data)) {
			$this->id = $id;
			$this->data = $this->Shift->sFind('first');
		}
		$this->loadModel('Area');
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
		$this->loadModel('Day');
		$this->Day->order = 'id';
		$this->set('days',$this->Day->sFind('list'));
	}
	
	function delete($id) {
		$this->Shift->id = $id;
		$this->Shift->recursive = -1;
		$shift = $this->Shift->sFind('first');
		$this->record();
		$this->Shift->sDelete($id);
		$this->stop($this->Shift->description);
		$this->redirect('/areas/schedule/'.$shift['Shift']['area_id']);
	}
	
}
?>
