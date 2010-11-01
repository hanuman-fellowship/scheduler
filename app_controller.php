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
		$userRoles = Set::combine(Authsome::get('Role'),'{n}.id','{n}.name');
		if ($this->Session->read('Schedule.user_id') == Authsome::get('id') && 
		in_array('operations',$userRoles)) {
			$this->Session->write('Schedule.editable',true);
		} else {
			$this->Session->write('Schedule.editable',false);
		}	


		// request areas for manager menu
		$this->loadModel('Area');
		$managerAreas = $this->Area->sFind('list', array(
			'conditions' => array(
				'Area.id' => Set::combine(Authsome::get('Manager'),'{n}.id','{n}.area_id')
			),
			'order' => 'Area.name'
		));
		if (count(Authsome::get('Manager')) > 0) {
			$managerMenu = array();
			foreach($managerAreas as $areaId => $areaName) {
				$managerMenu["{$areaName} Request Form"] = array(
					'url' => array('controller' => 'RequestAreas', 'action' => 'edit',$areaId)
				);
			}
			$managerMenu[] = '<hr/>';
		}
		$managerMenu['Change Password...'] = array(
			'url' => array('controller' => 'users', 'action' => 'changePassword'),
			'ajax'
		);
		$managerMenu['Logout'] = array(
			'url' => array('controller' => 'users', 'action' => 'logout'),
		);
		$this->set('managerMenu', $managerMenu);

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
		$this->Schedule->contain('User','ScheduleGroup');
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
		$this->Session->write('Schedule.Group',$schedule['ScheduleGroup']);
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
			if ($id == 'gaps') {
				$this->redirectIfNot('operations');
				return;
			}
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

	function redirectIfNot($role) {
		$userRoles = Set::combine(Authsome::get('Role'),'{n}.id','{n}.name');
		if (!in_array($role,$userRoles)) {
			$this->redirect('/');
		}
	}

	function beforeRender() {
		$this->{$this->modelClass}->insertFromBuffer();
	}

}
?>
