<?
class SchedulesController extends AppController {

	var $name = 'Schedules';

	var $helpers = array('schedule');

	var $components = array('Email');

	// just a test
	function export() {
		$file = fopen('hello.html', 'w');
		$content = $this->requestAction('/people/schedule/12',array('return'));
		fwrite($file, $content);
		fclose($file);
	}

	function copy($id = null) {
		$this->redirectIfNot('operations');
		$groupName = $this->Session->read('Schedule.Group.name');
		if (!empty($this->data)) {
			if ($this->Schedule->valid($this->data)) {
				$this->setSchedule($this->Schedule->copy(
					$this->data['Schedule']['id'] ? $this->data['Schedule']['id'] : scheduleId(),
					Authsome::get('id'),
					$this->data['Schedule']['name']
				));	
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->Schedule->errorField);
				$this->set('errorMessage',$this->Schedule->errorMessage);
			}
		} 
		$this->set('id',$id);
		$this->set('template',$this->Schedule->field('name',array(
			'Schedule.id' => $id
		)));
		$this->set('groupName',$groupName);
	}

	function copyTemplate() {
		$this->redirectIfNot('operations');
		$groupName = $this->Session->read('Schedule.Group.name');
		$this->set('templates',$this->Schedule->listTemplates());
		$this->set('groupName',$groupName);
	}
	
	function delete($id = null,$force = false) {
		if ($id && Authsome::get('id') == $this->Schedule->field('user_id', array('id' => $id))
		|| $force ) {
			$this->Schedule->delete($id);
			$this->setSchedule('latest');
			$this->redirect($this->referer());
		}
		$this->Schedule->order = 'id';
		$this->Schedule->contain();
		$this->set('schedules',$this->Schedule->find('all',array(
			'conditions' => array(
				'Schedule.user_id' => Authsome::get('id'),
				'Schedule.request' => 0
			)
		)));
		$this->set('schedule_id',scheduleId());			
	}

	function deleteTemplate($id = null) {
		$this->redirectIfNot('operations');
		if ($id) {
			$this->Schedule->delete($id);
			$this->setSchedule('latest');
			$this->redirect($this->referer());
		}
		$this->Schedule->order = 'name';
		$this->Schedule->contain();
		$this->set('schedules',$this->Schedule->find('all',array(
			'conditions' => array(
				'Schedule.template' => 1
			)
		)));
		$this->set('schedule_id',scheduleId());			
	}

	function select($id = null) {
		if ($id) {
			$this->setSchedule($id);
			$this->redirect($this->referer());
		}
		$this->Schedule->order = 'id';
		$this->Schedule->contain();
		$this->set('schedules',$this->Schedule->viewList());
		$this->set('schedule_id',scheduleId());		
	}

	function alternate() {
		$now = date('Y-m-d H:i:s');
		$this->set('alternates',
			$num_cur_schedules = $this->Schedule->ScheduleGroup->find('all',
				array(
					'conditions' => array(
						'ScheduleGroup.start <' => "{$now}",
						'ScheduleGroup.end >' => "{$now}"
					),
					'recursive' => -1
				)
			)
		);
	}
	
	function published() {
		$this->set('schedules',$this->Schedule->ScheduleGroup->getPublished());
	}

	function merge($id = null) {
		$this->redirectIfNotEditable();

		// if there's post data get it as $choices
		$choices = isset($this->data['Schedule']) ? $this->data['Schedule'] : array();

		$confirmed = !empty($this->data);

		// replopulate $id when receiving post data
		$id = isset($this->data['Schedule']['schedule_id']) ? $this->data['Schedule']['schedule_id'] : $id;

		$this->set('schedule',$this->Schedule->findById($id));

		if ($id) {
			$merged = $this->Schedule->merge($id,$choices,'dry_run');
			$this->set('schedule_id',$id);
			$this->set('descriptions',$merged['descriptions']);
			if ($confirmed) {
				$this->Schedule->merge($id,$choices);
				$this->set('url',$this->referer());
			}
			$this->set('changes',array_replace($merged['descriptions'],$merged['conflicts']));
			$this->set('conflicts',$merged['conflicts']? true : false);
		} else {
			$this->Schedule->order = 'id';
			$this->Schedule->contain();
			$this->set('schedules',$this->Schedule->find('all',array(
				'conditions' => array(
					'Schedule.name <>' => 'Published',
					'Schedule.parent_id' => $this->Session->read('Schedule.parent_id'),
					'Schedule.request' => 0
				)
			)));
			$this->set('schedule_id',scheduleId());		
			$this->set('parent_id',$this->Schedule->field('parent_id',array('id' => scheduleId())));		
		}
	}
	
	function change() {
		$this->redirectIfNotEditable();
		if (!empty($this->data)) {
			if ($this->Schedule->valid($this->data)) {
				$this->Schedule->change($this->data);
				$this->setSchedule(scheduleId());
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->Schedule->errorField);
				$this->set('errorMessage',$this->Schedule->errorMessage);
				$start = $this->data['Schedule']['start'];
				$end = $this->data['Schedule']['end'];
			}
		}
	}

	function publish() {
		$this->redirectIfNotEditable();
		$scheduleName = $this->Session->read('Schedule.name');
		if (!empty($this->data)) {
			if ($this->Schedule->valid($this->data)) {
				$this->setSchedule($this->Schedule->publish($this->data));
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->Schedule->errorField);
				$this->set('errorMessage',$this->Schedule->errorMessage);
			}
		} 
		$this->set('groupName',$this->Session->read('Group.name'));
		$this->set('scheduleName',$scheduleName);
	}

	function template() {
		$this->redirectIfNot('operations');
		$groupName = $this->Session->read('Schedule.Group.name');
		if (!empty($this->data)) {
			if ($this->Schedule->valid($this->data)) {
				$this->Schedule->template($this->data['Schedule']['name']);	
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->Schedule->errorField);
				$this->set('errorMessage',$this->Schedule->errorMessage);
			}
		} 
		$this->set('groupName',$groupName);
	}

	function newRequest($area_id = null, $name = null, $schedule_id = null) {
		if ($name) {
			$newScheduleId = $this->Schedule->addRequest($area_id,$name,$schedule_id);
			$this->setSchedule($newScheduleId);
			if (!$schedule_id) {
				$this->set('blank',true);
			} else {
				$this->redirect('/');
			}
		}
		if (!empty($this->data)) {
			$area_id = $this->data['Schedule']['area_id'];	
			if ($this->Schedule->valid($this->data)) {
				switch ($this->data['Schedule']['based_on']) {
					case 'template' :
						$this->set('templates',$this->Schedule->listTemplates());
						break;
					case 'published' :
						$this->set('schedules',$this->Schedule->ScheduleGroup->getPublished());
						break;
					case 'blank' :
						$this->redirect(array($area_id,$this->data['Schedule']['name']));
						break;
				}
			} else {
				$this->set('errorField',$this->Schedule->errorField);
				$this->set('errorMessage',$this->Schedule->errorMessage);
			}
		}
		$this->redirectIfNotManager($area_id);
		$this->set('area_id',$area_id);
		$this->set('areaName',$this->Schedule->Area->field('name',array(
			'Area.id' => $area_id,
			'Area.schedule_id' => scheduleId()
		)));
	}

	function editRequest($id = null) {
		if ($id) {
			$this->setSchedule($id);
			$this->redirect('/');
		}
		$this->set('requests',$this->Schedule->find('list', array(
			'conditions' => array(
				'Schedule.request' => 2,
				'Schedule.user_id' => Authsome::get('id')
			)
		)));
	}

	function deleteRequest($id = null) {
		if ($id) {
			$this->delete($id);
		}
		$this->set('requests',$this->Schedule->find('list', array(
			'conditions' => array(
				'Schedule.request' => 2,
				'Schedule.user_id' => Authsome::get('id')
			)
		)));
	}

	function deletePublishedRequest($id = null) {
		$this->redirectIfNot('operations');
		$this->set('requests',$this->Schedule->getRequests(true));
		if (!empty($this->data)) {
			$this->set('url', $this->referer());
			$this->Schedule->deleteRequests($this->data);
		} else {
			$this->data['Schedule']['schedule_id'] = array($id);
		}
	}

	function submitRequest() {
		$this->redirectIfNotManager($this->Session->read('last_area'));
		$this->loadModel('EmailAuth');
		if (!$this->EmailAuth->field('email',array('id' => 1))) {
		  $this->redirect(array('controller' => 'emailAuths', 'action' => 'noEmail','Operations'));
		}
		$this->Schedule->save(array('Schedule'=>array(
			'id' => $this->Session->read('Schedule.id'),
			'request' => 1
		)));
		$this->Session->write('Schedule.request',1);

		$areaName = $this->Schedule->Area->field('name',array(
			'Area.schedule_id' => $this->Session->read('Schedule.id')
		));
		$userEmail = Authsome::get('User.email');
		$username = Inflector::humanize(Authsome::get('User.username'));
		$auth = $this->EmailAuth->findById(1);

		// email the manager that the request was received
		if (!$this->_sendEmail(
			$userEmail, 
			'Area Request Form Received!', 
			'request_submit_mgr',
			array(
				'username' => $username,
				'areaName' => $areaName,
				'operationsEmail' => $auth['EmailAuth']['email'],
				'operationsName' => $auth['EmailAuth']['name']
			)
		)) $this->set('errorMessage',$this->Email->smtpError);

		$this->Email->reset();

		// email operations about the submitted request
		if ($this->_sendEmail(
			$auth['EmailAuth']['email'],
			"{$areaName} Request Form Submitted",
			'request_submit_prsnl',
			array(
				'username' => $username,
				'areaName' => $areaName,
				'userEmail' => $userEmail
			)
		)) $this->set('errorMessage',$this->Email->smtpError);

		$this->redirect($this->referer());
	}

	function viewRequest($id = null) {
		if ($id) {
			$current_schedule = $this->Session->read('Schedule.id');
			if ($this->Session->read('Schedule.editable') && !$this->Session->read('Schedule.request'))
				$this->set('accept',true);
			$this->setSchedule($id);
			$area = $this->Schedule->Area->sFind('first',array(
				'recursive' => -1,
				'fields' => array('Area.id')
			));
			$this->set('area',$this->Schedule->Area->getArea($area['Area']['id']));
			$this->set('bounds', $this->getBounds());
			$this->setSchedule($current_schedule);
		} else {
			$this->set('requests',$this->Schedule->getRequests());
		}
	}

	function accept($id) {
		$this->redirectIfNotEditable();
		$current = $this->Session->read('Schedule.id');
		$this->record();
		$this->setSchedule($id);
		$this->Schedule->Area->sContain('Shift');
		$acceptedArea = $this->Schedule->Area->sFind('first');
		$this->setSchedule($current);
		$this->Schedule->Area->clear($acceptedArea['Area']['id'],false);
		foreach($acceptedArea['Shift'] as $shift) {
			$shift['schedule_id'] = $current;
			unset($shift['id']);
			$this->Schedule->Area->Shift->create();
			$this->Schedule->Area->Shift->sSave(array('Shift'=>$shift));
		}
		$this->stop("{$acceptedArea['Area']['name']} Request accepted");
		$this->redirect(array(
			'controller'=>'areas',
			'action'=>'schedule',
			$acceptedArea['Area']['id']
		));
	}

}
?>
