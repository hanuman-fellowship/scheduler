<?
class SchedulesController extends AppController {

	var $name = 'Schedules';

	var $helpers = array('schedule');

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
		$this->set('templates',$this->Schedule->find('list',array(
			'conditions' => array(
				'schedule_group_id' => 0,
				'user_id' => 0
			),
			'order' => 'Schedule.name asc'
		)));
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
				'Schedule.user_id' => Authsome::get('id')
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
				'Schedule.schedule_group_id' => 0,
				'Schedule.user_id' => 0
			)
		)));
		$this->set('schedule_id',scheduleId());			
	}

	function select($id = null, $autoSelect = 0) {
		if ($id) {
			if ($autoSelect) {
				$this->saveSetting('auto_select',$id);
			}
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
					'Schedule.parent_id' => $this->Session->read('Schedule.parent_id')
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

}
?>
