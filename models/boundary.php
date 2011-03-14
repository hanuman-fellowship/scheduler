<?php
class Boundary extends AppModel {

	var $name = 'Boundary';

	var $belongsTo = array(
		'Day',
		'Slot'
	);

	function getBounds() {
		$this->sContain('Day','Slot');
		$bounds = $this->sFind('all');				
		$days = Set::combine($bounds,'{n}.Day.id','{n}.Day.name');
		$slots = Set::combine($bounds,'{n}.Slot.id','{n}.Slot.name');
		$bounds = Set::combine($bounds,'{n}.Boundary.day_id',"{n}.Boundary", '{n}.Boundary.slot_id');
		foreach($days as $num => $day) {
			if ($day == '') {
				unset($days[$num]);
			}
		}
		return compact('days','slots','bounds');
	}

	function valid($data) {
		foreach($data as $key => $val) {
			$parts = explode('_',$key);
			if ($val == '') {
				$this->errorField = $key;
				$this->errorMessage = "Please fill in every field";
				return false;
			}
			if ($parts[0] == 'bound') {
				$time = strtotime($val);
				if (!$time) {
					$this->errorField = $key;
					$this->errorMessage = "Sorry, this time doesn't make sense to me";
					return false;
				}
				$next = $parts[0].'_'.($parts[1]+1).'_'.$parts[2];
				if (isset($data[$next])) {
					if ($time >= strtotime($data[$next])) {
						$this->errorField = $key;
						$this->errorMessage = "Times can't overlap";
						return false;
					}
				}
			}
		}
	}

}
?>
