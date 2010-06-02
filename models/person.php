<?php
class Person extends AppModel {

	var $name = 'Person';
	var $validate = array(
		'nickname' => array('notempty'),
		'first' => array('notempty'),
		'last' => array('notempty'),
		'resident_category_id' => array('numeric')
	);
	

	var $belongsTo = array(
		'ResidentCategory'
	);

	var $hasMany = array(
		'Assignment',
		'FloatingShift',
		'OffDay'
	);

	function available($shift_id) {
		$this->Assignment->Shift->id = $shift_id;
		$this->Assignment->Shift->recursive = -1;
		$shift = $this->Assignment->Shift->sFind('first');
		$this->sContain('OffDay','Assignment.Shift');
		$people = $this->sFind('all');
		$list = array();
		foreach($people as $person_num => $person) {
			$list[$person_num] = $person['Person'];
			$list[$person_num]['available'] = true; // benefit of the doubt
			foreach($person['OffDay'] as $OffDay) {
				
				if ($shift['Shift']['day_id'] == $OffDay['day']) {
					$list[$person_num]['available'] = false; // it's their off day
					continue;
				}
			}
			foreach($person['Assignment'] as $assignment) {
				$a = $shift['Shift'];
				$b = $assignment['Shift'];
				if ($a['id'] == $b['id']) {
					$list[$person_num]['available'] = false; // they are already on that shift
					continue;
				}
				if (
					($a['day_id'] == $b['day_id']) && ( // the shifts are on the same day AND
						($a['start'] >= $b['start'] && $a['start'] <= $b['end']) || // a starts during b or
						($b['start'] >= $a['start'] && $b['start'] <= $a['end'])    // b starts during a
					)
				) {
					$list[$person_num]['available'] = false; // they have are on a conflicting shift
					continue;
				}
			}
		}
		return $list;
	}

}
?>