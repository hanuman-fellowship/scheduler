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


	function copy() {
		$this->redirectIfNot('operations');
		$groupName = $this->Session->read('Schedule.Group.name');
		if (!empty($this->data)) {
			if ($this->Schedule->valid($this->data)) {
				$this->setSchedule($this->Schedule->copy(
					Authsome::get('id'),
					$this->data['Schedule']['name']
				));	
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->Schedule->errorField);
				$this->set('errorMessage',$this->Schedule->errorMessage);
			}
		} 
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
	
	function past() {
		$this->set('schedules',$this->Schedule->ScheduleGroup->getPublished());
	}

	function merge($id = null) {
		$this->redirectIfNotEditable();

		// if there's post data get it as $conflicts
		$conflicts = isset($this->data['Schedule']['conflicts']) ? $this->data['Schedule'] : array();

		$confirm = empty($this->data);

		// replopulate $id when receiving post data
		$id = isset($this->data['Schedule']['schedule_id']) ? $this->data['Schedule']['schedule_id'] : $id;

		if ($id) {
			$merged = $this->Schedule->merge($id,$conflicts,'dry_run');
			$this->set('schedule_id',$id);
			$this->set('descriptions',$merged['descriptions']);
			if ($confirm) {
				$this->set('schedule',$this->Schedule->findById($id));
				$this->render('confirm_merge');
			} else {
				if ($merged['success']) {
					$this->Schedule->merge($id,$conflicts);
					$this->render('merged');
				} else {
					$this->set('conflicts',$merged['conflicts']);
					$this->render('conflicts');
				}
			}
		}
		$this->Schedule->order = 'id';
		$this->Schedule->contain();
		$this->set('schedules',$this->Schedule->find('all',array(
			'conditions' => array(
				'Schedule.name <>' => 'Published'
			)
		)));
		$this->set('schedule_id',scheduleId());		
		$this->set('parent_id',$this->Schedule->field('parent_id',array('id' => scheduleId())));		
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
}
?>
