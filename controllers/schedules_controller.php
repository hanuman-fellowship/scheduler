<?
class SchedulesController extends AppController {

	var $name = 'Schedules';
	
	function newBranch() {
		if ($user = Authsome::get('id') && !empty($this->data)) {
			$this->setSchedule($this->Schedule->newBranch($user, $this->data['name']));	
			$this->redirect($this->loadPage());
		}
		$this->savePage();
	}
	
	function deleteBranch($id = null) {
		if ($id && Authsome::get('id') == $this->Schedule->field('user_id', array('id' => $id)) ) {
			$this->setSchedule($this->Schedule->deleteBranch($id));	
   		    $this->redirect($this->loadPage());
		}
		$this->savePage();
		$this->Schedule->order = 'id';
		$this->Schedule->contain();
		$this->set('schedules',$this->Schedule->find('all'));
		$this->set('schedule_id',$this->Schedule->schedule_id);			
	}
	
	function selectBranch($id = null) {
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
	
	function mergeBranch($id = null) {
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
