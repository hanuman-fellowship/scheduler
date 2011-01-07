<?
class ScheduleGroup extends AppModel {

	var $name = 'ScheduleGroup';
	
	var $hasMany = array(
		'Schedule'
	);

	function getPublished() {
		$published = $this->find('all',array(
			'contain' => array(
				'Schedule'
			)
		));
		foreach($published as &$schedules) {
			foreach($schedules['Schedule'] as $num => $schedule) {
				if ($schedule['name'] != 'Published') unset($schedules['Schedule'][$num]);
			}
			$schedules['Schedule'] = Set::sort($schedules['Schedule'],'{n}.updated','desc');
		}
		$published = Set::sort($published,'{n}.Schedule.0.updated','desc');
		return $published;
	}

}
