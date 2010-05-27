<?php
class PeopleController extends AppController {

	var $name = 'People';
	var $scaffold;
	var $helpers = array('schedule');
		
	/**
	 * Displays the schedule for the specified person.
	 * 
	 */
	function schedule($id = null) {	
		$this->Person->id = $id;
		$this->Person->contain('Shift.Area','ResidentCategory','OffDay','FloatingShift.Area');
		$this->set('person',$this->Person->find('first'));
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
	}	
}
	
?>