<?php
class AreasController extends AppController {

	var $name = 'Areas';
	var $helpers = array('schedule');

	function schedule($id = null) {
		$this->Area->id = $id;
		$this->Area->sContain('Shift.Assignment.Person.ResidentCategory');
		$this->set('area',$this->Area->sFind('first'));
		$this->set('days', ClassRegistry::init('Days')->find('all'));
		$days = ClassRegistry::init('Days')->find('all');
		$this->set('days',Set::combine($days,'{n}.Days.id','{n}.Days.name'));
		$times = ClassRegistry::init('Times')->find('all');
		$this->set('times',
			Set::combine($times,
				'{n}.Times.id','{n}.Times.name'
			)
		);
		$bounds = ClassRegistry::init('Boundaries')->find('all');
		// the boundry data for each day grouped by time
		$this->set('bounds',
			Set::combine($bounds,
				'{n}.Boundaries.day_id',"{n}.Boundaries", '{n}.Boundaries.time_id'
			)
		);
		//$this->set('updated', $this->Session->read('Schedule.Schedule.updated'));
	}

}
?>