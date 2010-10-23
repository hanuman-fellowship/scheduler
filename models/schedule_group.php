<?
class ScheduleGroup extends AppModel {

	var $name = 'ScheduleGroup';
	
	var $actsAs = array('Linkable');

	var $hasMany = array(
		'Schedule'
	);

	function getPublished() {
		$published = $this->find('all',array(
			'order' => 'ScheduleGroup.id desc',
			'conditions' => array(
				'Schedule.name' => 'Published'
			),
			'link' => array(
				'Schedule'
			)
		));
		$published = Set::combine($published,'{n}.ScheduleGroup.id','{n}.ScheduleGroup');
		return $published;
	}

}
