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
		
		// if the session has timed out, redirect to the login
		if (!$this->Session->check('User')) {
			$this->Session->write('User',array());
			$this->redirect('/');
		}
	
		// put the latest published schedule into the session
		if (!$this->Session->check('Schedule')) {
			$this->setSchedule('latest');
		}
		if ($this->Session->read('Schedule.user_id') == Authsome::get('id')) {
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
		if (!$this->{$model}->field('id')) {
			$this->redirect('/');
		}
		if ($model == 'Person') {
			if (!$this->Person->PeopleSchedules->field('id',array(
				'PeopleSchedules.person_id' => $id,
				'PeopleSchedules.schedule_id' => $this->Person->schedule_id
			))) {
				$this->redirect('/');
			}
		}
	}
}
?>
