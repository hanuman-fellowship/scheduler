<?
class SchedulesController extends AppController {

	var $name = 'Schedules';
	
	function showPerson($id) {
 		$sch = $this->Session->read('Schedule.id');
		$this->Schedule->Person->contain("Hobby.schedule_id = {$sch}");
		$data = $this->Schedule->Person->find('all', array(
			'conditions' => array(
				'Person.id' => $id,
				'Person.schedule_id' => $sch
			)
		));
		debug($data);
	}

	function doNewBranch($user_id, $parent_id) {
		$this->setSchedule($this->Schedule->newBranch($user_id,$parent_id));
	}
	
	function doDeleteBranch($id) {
		$this->Schedule->deleteBranch($id);
	}
	
}
?>