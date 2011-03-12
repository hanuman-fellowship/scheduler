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
		setScheduleId($this->Session->read('Schedule.id'));
		$userRoles = Set::combine(Authsome::get('Role'),'{n}.id','{n}.name');
		if ($this->Session->read('Schedule.user_id') == Authsome::get('id') && 
		in_array('operations',$userRoles)) {
			$this->Session->write('Schedule.editable',true);
		} else {
			$this->Session->write('Schedule.editable',false);
		}	

		$this->loadModel('Schedule');

		if (isset($this->params['url']['url'])) {
			if ($this->params['url']['url'] == '/' && $this->Session->read('Schedule.request')) {
				$area = $this->Schedule->Area->sFind('first');
				$this->redirect(array('controller' => 'areas', 'action' => 'schedule', $area['Area']['id']));
			}
		}

		// request areas for manager menu
		$managerAreas = $this->Schedule->Area->find('list', array(
			'conditions' => array(
				'Area.id' => Set::combine(Authsome::get('Manager'),'{n}.id','{n}.area_id'),
				'Area.schedule_id' => $this->Schedule->getLatestId()
			),
			'order' => 'Area.name'
		));
		if (count(Authsome::get('Manager')) > 0) {
			$managerMenu = array(
				'Edit Existing Request...' => array(
					'url' => array('controller' => 'schedules', 'action' => 'editRequest'),
					'ajax'
				),
				'Delete Request...' => array(
					'url' => array('controller' => 'schedules', 'action' => 'deleteRequest'),
					'ajax'
				),
				'<hr/>'
			);
			foreach($managerAreas as $areaId => $areaName) {
				$managerMenu["New {$areaName} Request..."] = array(
					'url' => array('controller' => 'schedules', 'action' => 'newRequest',$areaId),
					'ajax'
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
			'shortcut' => 'ctrl+l'
		);
		$this->set('managerMenu', $managerMenu);

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
		$now = date('Y-m-d H:i:s');
		$this->Schedule->contain('User','ScheduleGroup');
		$params = ($id == 'latest') ? 
			array(
				'conditions' => array(
					'Schedule.name' => 'Published',
					'ScheduleGroup.start <' => "{$now}",
					'ScheduleGroup.end >' => "{$now}"
				),
				'order' => array(
					'ScheduleGroup.end asc',
					'ScheduleGroup.start desc',
					'Schedule.updated desc'
				)
			):
			array(
				'conditions' => array('Schedule.id' => $id)
			);		
		$schedule = $this->Schedule->find('first',$params);
		if (!$schedule) {
			unset($params['conditions']['ScheduleGroup.end >']);
			$schedule = $this->Schedule->find('first',$params);
		}
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
		
		$latest_in_group = $this->Schedule->field('id',
			array(
				'Schedule.name' => 'Published',
				'Schedule.schedule_group_id' => $schedule['ScheduleGroup']['id']
			),
			'Schedule.id desc'
		);
		$this->Session->write(
			'Schedule.latest_in_group', 
			($latest_in_group == $schedule['Schedule']['id'])
		);

		setScheduleId($schedule['Schedule']['id']);

		$num_cur_schedules = $this->Schedule->ScheduleGroup->find('count',
			array(
				'conditions' => array(
					'ScheduleGroup.start <' => "{$now}",
					'ScheduleGroup.end >' => "{$now}"
				)
			)
		);
		$this->Session->write('Schedule.Group.alternate',($num_cur_schedules > 1));

		deleteCache();
	}
	
	function record() {
		$this->loadModel('Change');
		$this->Change->clearHanging(); 
	}
	
	function stop($description) {
		// record the main Change model entry
		$this->loadModel('Change');
        $this->Change->save(array( 
            'Change' => array( 
                'id' => $this->Change->id, 
                'description' => $description
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
				'PeopleSchedules.schedule_id' => scheduleId()
			))) {
				$this->redirect('/');
			}
		} else if (!$this->{$model}->field('id',array(
			"{$model}.id" => $id,
			"{$model}.schedule_id" => scheduleId()
		))) {
			$this->redirect('/');
		}
	}

	function getBounds() {
		if (!checkCache('bounds')) {
			$this->loadModel('Boundary');
			writeCache('bounds',$this->Boundary->getBounds());
		}
		return readCache('bounds');
	}

	function getChangeMessages() {
		$this->loadModel('Change');
		return $this->Change->getMessages();
	}

	function redirectIfNotEditable() {
		if (!$this->Session->read('Schedule.editable') && $this->Session->read('Schedule.request') != 2) {
			$this->redirect('/');
		}
	}

	function redirectIfNot($role) {
		$userRoles = Set::combine(Authsome::get('Role'),'{n}.id','{n}.name');
		if (!in_array($role,$userRoles)) {
			$this->redirect('/');
		}
	}

	function redirectIfNotManager($id) {
		$areas = Set::combine(Authsome::get('Manager'),'{n}.id','{n}.area_id');
		if (!in_array($id,$areas)) {
			$this->redirect('/');
		}
	}

	function redirect($url) {
		$this->{$this->modelClass}->doQueue();
		parent::redirect($url);
	}
		
	function beforeRender() {
		if ($this->modelClass != 'CakeError') {
			$this->{$this->modelClass}->doQueue();
		}
	}

	function _sendEmail($to, $subject, $template, $viewVars, $from = null, $username = null,$password = null) {
		$this->loadModel('EmailAuth');
		if (!$this->EmailAuth->field('email',array('id' => 2))) {
			$this->redirect(array('controller' => 'emailAuths', 'action' => 'noEmail','Scheduler'));
		}
		$auth = $this->EmailAuth->findById(2);
		$this->Email->from  = $from ? $from : "{$auth['EmailAuth']['name']} <{$auth['EmailAuth']['email']}>";
		if ($from) $this->Email->replyTo = $from;
		$this->Email->delivery = 'smtp';
		$this->Email->smtpOptions = array(
			'port' => '465',
			'timeout' => '30',
			'auth' => true,
			'host' => 'ssl://smtp.gmail.com',
			'username' => $username? $username : $auth['EmailAuth']['email'],
			'password' => $password? $password : $auth['EmailAuth']['password']
		);
		if (is_array($to)) {
			$emails = '';
			foreach($to as &$email) {
				$email = "<{$email}>";
			}
			$this->Email->to = "<{$auth['EmailAuth']['email']}>";
			$this->Email->bcc = $to;
		} else {
			$this->Email->to = "<{$to}>";
		}
		$this->Email->subject = $subject;
		if ($template) $this->Email->template = $template;
		if (is_array($viewVars)) {
			foreach($viewVars as $key => $val) {
				$this->set($key, $val);
			}
			return $this->Email->send();
		} else {
			return $this->Email->send($viewVars);
		}
	}

}
?>
