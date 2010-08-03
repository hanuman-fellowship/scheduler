<?
class SchedulesController extends AppController {

	var $name = 'Schedules';
	
	function add() {
		if (!empty($this->data)) {
			if ($this->Schedule->valid($this->data)) {
				$this->setSchedule($this->Schedule->newBranch(
					Authsome::get('id'),
					$this->data['Schedule']['name']
				));	
				$this->set('url', $this->referer());
			} else {
				$this->set('errorField',$this->Schedule->errorField);
				$this->set('errorMessage',$this->Schedule->errorMessage);
			}
		}
	}
	
	function delete($id = null) {
		if ($id && Authsome::get('id') == $this->Schedule->field('user_id', array('id' => $id)) ) {
			$this->setSchedule($this->Schedule->deleteBranch($id));	
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
	
	function select($id = null) {
		if ($id && in_array($this->Schedule->field('user_id', array('id' => $id)),
			array(
				Authsome::get('id'),
				null
			)
		)) {
			$this->setSchedule($id);
   		    $this->redirect($this->loadPage());
		}
		$this->savePage();		
		$this->Schedule->order = 'id';
		$this->Schedule->contain();
		$this->set('schedules',$this->Schedule->find('all'));
		$this->set('schedule_id',$this->Schedule->schedule_id);		
	}
	
	function merge($id = null) {
		if ($id) {
			$this->Schedule->mergeBranch($id);
			$this->redirect($this->loadPage());
		}
		$this->savePage();
		$this->Schedule->order = 'id';
		$this->Schedule->contain();
		$this->set('schedules',$this->Schedule->find('all'));
		$this->set('schedule_id',$this->Schedule->schedule_id);		
		$this->set('parent_id',$this->Schedule->field('parent_id',array('id' => $this->Schedule->schedule_id)));		
	}
	
}
?>
