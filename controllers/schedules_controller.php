<?
class SchedulesController extends AppController {

	var $name = 'Schedules';
	
	function add() {
		$scheduleName = $this->Session->read('Schedule.name');
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
		$this->set('scheduleName',$scheduleName);
	}
	
	function delete($id = null) {
		if ($id && Authsome::get('id') == $this->Schedule->field('user_id', array('id' => $id)) ) {
			$this->setSchedule($this->Schedule->delete($id));	
 		    $this->redirect($this->referer());
		}
		$this->Schedule->order = 'id';
		$this->Schedule->contain();
		$this->set('schedules',$this->Schedule->find('all',array(
			'conditions' => array(
				'Schedule.user_id' => Authsome::get('id')
			)
		)));
		$this->set('schedule_id',$this->Schedule->schedule_id);			
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
		$this->set('schedule_id',$this->Schedule->schedule_id);		
	}
	
	function past() {
		$this->set('schedules',$this->Schedule->find('all', array(
			'conditions' => array('Schedule.name' => 'Published'),
			'order' => 'Schedule.updated desc',
			'recursive' => -1
		)));
	}

	function merge($id = null) {
		if ($id) {
			$this->Schedule->merge($id);
			$this->redirect($this->loadPage());
		}
		$this->savePage();
		$this->Schedule->order = 'id';
		$this->Schedule->contain();
		$this->set('schedules',$this->Schedule->find('all',array(
			'conditions' => array(
				'Schedule.name <>' => 'Published'
			)
		)));
		$this->set('schedule_id',$this->Schedule->schedule_id);		
		$this->set('parent_id',$this->Schedule->field('parent_id',array('id' => $this->Schedule->schedule_id)));		
	}
	
	function publish() {
		if (Authsome::get('id') == $this->Session->read('Schedule.user_id')) {
			$this->setSchedule($this->Schedule->publish());
		}
		$this->redirect($this->referer());
	}
}
?>
