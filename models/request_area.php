<?php
/*
 * 
 **/

class RequestArea extends AppModel {

	var $name = 'RequestArea';

	var $hasMany = array(
		'RequestShift'
	);

	function edit($id) {
		if (!$area = $this->find('first',array('conditions' => array('RequestArea.id' => -1 * $id)))) {
			// there is no request for this area, so create one
			$this->Area = ClassRegistry::init('Area');
			$this->Area->schedule_id = $this->schedule_id;
			$this->Area->sContain('Shift.Assignment');
			$area = $this->Area->sFind('first',array(
				'conditions' => array(
					'Area.id' => $id
				),
				'fields' => array('id','name','notes')
			));
			$area['Area']['id'] = $area['Area']['id'] * -1;
			$shiftValues = '';
			$assignmentValues = '';
			foreach($area['Shift'] as &$shift) {
				$shift['id'] = $shift['id'] * -1;
				$shift['request_area_id'] = $shift['area_id'] * -1;
				$shiftValues .= "(
					'{$shift['id']}',
					'{$shift['request_area_id']}',
					'{$shift['day_id']}',
					'{$shift['start']}',
					'{$shift['end']}',
					'{$shift['num_people']}'
				),";
				foreach($shift['Assignment'] as $assignment) {
					$assignment['id'] = $assignment['id'] * -1;
					$assignmentValues .= "(
						'{$assignment['id']}',
						'{$assignment['person_id']}',
						'{$assignment['name']}',
						'{$shift['id']}'
					),";
				}
			}
			$shiftValues = substr_replace($shiftValues,'',-1);
			$assignmentValues = substr_replace($assignmentValues,'',-1);
			$this->query("INSERT INTO request_areas (id,name,notes) 
				VALUES ('{$area['Area']['id']}','{$area['Area']['name']}','{$area['Area']['notes']}')");
			$this->query("INSERT INTO request_shifts (id,request_area_id,day_id,start,end,num_people)
				VALUES {$shiftValues}");
			$this->query("INSERT INTO request_assignments (id,person_id,name,request_shift_id)
				VALUES {$assignmentValues}");
		} else {
			// there's already a request in progress so get that data
			$this->contain('RequestShift.RequestAssignment');
			$area = $this->find('first',array(
				'conditions' => array('RequestArea.id' => $id * -1)
			));
		}
	}

}
?>
