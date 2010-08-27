<?php

class AppController extends Controller {
	var $helpers = array('Html','Session','Form','Ajax','Javascript','Role', 'Time','Dialog');
	
    public $components = array(
    	'Session',
    	'RequestHandler',
        'Authsome.Authsome' => array(
            'model' => 'User'
        )
    );
        
	function beforeFilter() {

		// if the session has timed out, redirect 
		if (!$this->Session->check('User')) {
			$this->Session->write('User',array());
			$this->redirect('/');
		}
	
		// put the latest published schedule into the session
		if (!$this->Session->check('Schedule')) {
			$this->setSchedule('latest');
		}
		if ($this->Session->read('Schedule.user_id') == Authsome::get('id') && 
		Authsome::get('role') == 'operations') {
			$this->Session->write('Schedule.editable',true);
		} else {
			$this->Session->write('Schedule.editable',false);
		}	

	}	
	
    function loadModel($modelClass = null, $id = null) {
    	$modelObject = parent::loadModel($modelClass, $id);
		$this->$modelClass->schedule_id = $this->Session->read('Schedule.id');
		return $modelObject;
	}	
	
	function saveSetting($key, $val) {
		$this->loadModel('Setting');
		$user_id = Authsome::get('id');
		$id = $this->Setting->field('id', array(
			'Setting.key' => $key,
			'Setting.user_id' => $user_id
		));
		$setting = array(
			'Setting' => array(
				'user_id' => $user_id,
				'key' => $key,
				'val' => $val
			)
		);
		if ($id) {
			$setting['Setting']['id'] = $id;
		}
		$this->Setting->save($setting);
	}

	function loadSetting($key) {
		$this->loadModel('Setting');
		$user_id = Authsome::get('id');
		return $this->Setting->field('val', array(
			'Setting.key' => $key,
			'Setting.user_id' => $user_id
		));
	}

	function setSchedule($id) {
		$this->loadModel('Schedule');
		$this->Schedule->contain('User');
		$params = ($id == 'latest') ? 
			array(
				'conditions' => array('Schedule.user_id' => null),
				'order' => 'Schedule.id desc'
			):
			array(
				'conditions' => array('Schedule.id' => $id)
			);		
		$schedule = $this->Schedule->find('first',$params);
		$this->Session->write('Schedule', $schedule['Schedule']);	
		$this->Session->write('Schedule.username', $schedule['User']['username']);
		$latestSchedule = $this->Schedule->field(
			'id',
			array('Schedule.name' => 'Published'),
			'Schedule.updated desc'
		);
		$latest = ($id == 'latest' || $id == $latestSchedule) ? true : false;
		$this->Session->write('Schedule.latest', $latest);
		$this->Session->delete('cache');
	}
	
	function record() {
		$this->loadModel('Change');
        $this->Change->clearHanging(); 
        $this->Change->nudge(1);
	}
	
	function stop($description) {
		// record the main Change model entry
		$this->loadModel('Change');
        $this->Change->save(array( 
            'Change' => array( 
                'id' => 0, 
                'description' => $description,
                'schedule_id' => $this->Session->read('Schedule.id')
            ) 
        )); 	
	}	
	
	function savePage() {
		$this->Session->write('referer',$this->referer());
	}
	
	function loadPage() {
		return $this->Session->read('referer');
	}
	
	function redirectIfNotValid($id) {
		$model = $this->modelNames[0];
		$this->{$model}->id = $id;
		if ($model == 'Person') {
			if (!$this->Person->PeopleSchedules->field('id',array(
				'PeopleSchedules.person_id' => $id,
				'PeopleSchedules.schedule_id' => $this->Person->schedule_id
			))) {
				$this->redirect('/');
			}
		} else if (!$this->{$model}->field('id',array(
			"{$model}.id" => $id,
			"{$model}.schedule_id" => $this->{$model}->schedule_id
		))) {
			$this->redirect('/');
		}
	}

	function getBounds() {
		if (!$this->Session->check('cache.bounds')) {
			$this->loadModel('Boundary');
			$this->Session->write('cache.bounds',$this->Boundary->getBounds());
		}
		return $this->Session->read('cache.bounds');
	}

	function getChangeMessages() {
		$this->loadModel('Change');
		return $this->Change->getMessages();
	}

	function redirectIfNotEditable() {
		if (!$this->Session->read('Schedule.editable')) {
			$this->redirect('/');
		}
	}

}
?>
