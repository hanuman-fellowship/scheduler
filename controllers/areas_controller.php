<?php
class AreasController extends AppController {

	var $name = 'Areas';
	var $helpers = array('Schedule');

  function dups() {
    $this->Area->Shift->Assignment->dups(); die;
  }

	function schedule($id = null) {
		if ($id) {
			$this->redirectIfNotValid($id);
			$this->set('area',$this->Area->getArea($id));
			$this->set('bounds', $this->getBounds());
			if (!isset($this->params['requested'])) {
				$this->set('change_messages',$this->getChangeMessages());
				$this->Session->write('last_area',$id);
				$this->loadModel('Schedule');
				$this->set('request_id',$this->Schedule->requestByArea($id));
			} else {
				$this->set('print',true);
			}
		} else {
			if ($this->params['isAjax']) {
				$this->render('redirect');
			} else {
				$this->redirect('/');
			}
		}
	}
	
	function add($area_id = null) {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->Area->valid($this->data)) {
				$this->Area->create();
				$this->record();
				$changes = $this->Area->sSave($this->data);
				$this->stop($this->Area->description($changes));
				$this->set('url', array('controller' => 'areas', 'action' => 'schedule', $this->Area->id));
			} else {
				$this->set('errorField',$this->Area->errorField);
				$this->set('errorMessage',$this->Area->errorMessage);
			}
		}
	}
	
	function edit($id = null) {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->Area->valid($this->data)) {
				$this->record();
				$changes = $this->Area->sSave($this->data);
				$this->stop($this->Area->description($changes));
				$this->set('url', array('controller' => 'areas', 'action' => 'schedule', $this->data['Area']['id']));
			 } else {
				$this->set('errorField',$this->Area->errorField);
				$this->set('errorMessage',$this->Area->errorMessage);
			}
		} else {
			$this->id = $id;
			$this->data = $this->Area->sFind('first');
		}
	}
	
	function editNotes($id = null) {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			$this->record();
			$changes = $this->Area->sSave($this->data);
			$this->stop($this->Area->description($changes));
			$this->set('url',$this->referer());
		} else {
			$this->id = $id;
			$this->data = $this->Area->sFind('first');
		}
	}

	function delete($id = null) {
		$this->redirectIfNotEditable();
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
		if (!empty($this->data)) {
			$this->set('area_id',$this->data['Area']['area_id']);
			$this->set('url', $this->referer());
			if ($this->data['Area']['area_id']) {
				$this->record();
				$changes = $this->Area->sDelete($this->data['Area']['area_id']);
				$this->stop($this->Area->description($changes));
			}
		} else {
			$this->data['Area']['area_id'] = array($id);
		}
	}
	
	function clear($id = null) {
		$this->redirectIfNotEditable();
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
		if (!empty($this->data) ) {
			$this->set('area_id',$this->data['Area']['area_id']);
			$this->set('url', $this->referer());
			if ($this->data['Area']['area_id']) {
				$this->record();
				$changes = $this->Area->clear(
					$this->data['Area']['area_id'],$this->data['Area']['keep_shifts']);
				$this->stop($this->Area->description($changes));
			}
		} else {
			$this->data['Area']['area_id'] = array($id);
		}
	}

	function select() {
		$this->Area->recursive = -1;
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
	}

	function previous($id) {
		$this->Area->recursive = -1;
		$this->Area->order = 'name';
		$areas = $this->Area->sFind('list');
		while(list($key, $val) = each($areas)) {
			if ($key == $id) {
				prev($areas);
				prev($areas);
				$goto = each($areas); 
				$this->redirect(array('action'=>'schedule',$goto['key']));
			}
		}
	}

	function next($id) {
		$this->Area->recursive = -1;
		$this->Area->order = 'name';
		$areas = $this->Area->sFind('list');
		while(list($key, $val) = each($areas)) {
			if ($key == $id) {
				$goto = each($areas);
				$this->redirect(array('action'=>'schedule',$goto['key']));
			}
		}
	}

	function printm($id = null) {
		$output = '';
		if (!empty($this->data)) {
			foreach($this->data['Area']['area_id'] as $id) {
				$output .= $this->requestAction(
					array('controller'=>'areas','action'=>'schedule'),
					array('pass'=>array($id),'return')
				);
			}
			$this->set('output',$output);
			$this->set('back',$this->referer());
		} else {
			$this->Area->recursive = -1;
			$this->Area->order = 'name';
			$this->set('areas',$this->Area->sFind('list'));
			$this->data['Area']['area_id'] = array($id);
			$this->render('select_print');
		}	
	}

	function changed() {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if (isset($this->data['Area']['since'])) {
				if ($this->data['Area']['since'] != '' &&
				!strtotime($this->data['Area']['since'])) {
					$this->set('errorMessage',"Don't understand that time");
					$this->set('errorField','since');
				} else {
					$since = strtotime($this->data['Area']['since']);
					$changed = $this->Area->getChanged($since);
					$areas = $this->Area->sFind('list');
					foreach($areas as $id => $name) {
						if (!in_array($id,array_keys($changed))) unset($areas[$id]);
					}
					$this->set('areas',$areas);
					$this->set('changed',$changed);
				}
			}
		}	
	}

}
?>
