<?php
class OffDaysController extends AppController {

	var $name = 'OffDays';

	function toggle($person_id, $day_id) {
		$this->redirectIfNotEditable();
		$this->OffDay->id = null;
		$existing = $this->OffDay->sFind('first',array(
			'recursive' => -1,
			'conditions' => array(
				'OffDay.person_id' => $person_id,
				'OffDay.day_id' => $day_id
			)
		));
		$this->record();
		$changes = $existing ?
			$this->OffDay->sDelete($existing['OffDay']['id'])
		:
			$this->OffDay->sSave(array(
				'OffDay' => array(
					'person_id' => $person_id,
					'day_id' => $day_id
				)
			))
		;
		$this->stop($this->OffDay->description($changes));
		$this->redirect($this->referer());
	}

}
?>
