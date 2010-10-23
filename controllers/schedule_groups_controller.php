<?php
class ScheduleGroupsController extends AppController {

	var $name = 'ScheduleGroups';

	function select($id) {
		$schedule_id = $this->ScheduleGroup->Schedule->field('id',array(
			'Schedule.schedule_group_id' => $id
		),array('Schedule.id desc'));
		$this->setSchedule($schedule_id);
		$this->redirect($this->referer());
	}
	

}
