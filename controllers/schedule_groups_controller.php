<?php
class ScheduleGroupsController extends AppController {

	var $name = 'ScheduleGroups';

	function select($id) {
		$this->setSchedule($this->ScheduleGroup->firstInGroup($id));
		$this->redirect($this->referer());
	}
	
	function newRequest($area_id,$name,$id) {
		$this->redirectIfNotManager($area_id);
		$newScheduleId = $this->ScheduleGroup->Schedule->addRequest($area_id,$name,$this->ScheduleGroup->firstInGroup($id));
		$this->setSchedule($newScheduleId);
		$this->redirect(array('controller'=>'areas','action'=>'schedule',$area_id));
	}

}
