<?php
/*
 * request tables are simpler copies of areas, assignments, and shifts.
 * negative ids represent requests in progress, and positive ids are publisjed requests
 * the area id  number corresponds to the area id.
 **/

class RequestArea extends AppModel {

	var $name = 'RequestArea';

	var $hasMany = array(
		'RequestShift'
	);

	function edit($id,$force) {
		if (!$area = $this->find('first',array('conditions' => array('RequestArea.id' => -1 * $id)))) {
			// there is no request for this area, so create one
			$this->Area = ClassRegistry::init('Area');
			$this->Area->schedule_id = $this->schedule_id;
			$this->Area->sContain('Shift.Assignment');
			$area = $this->Area->sFind('first',array(
				'conditions' => array(
					'Area.id' => $id
				),
				'fields' => array('id','name','notes','manager')
			));
			$area['Area']['id'] = $area['Area']['id'] * -1;
			$this->query("INSERT INTO request_areas (id,name,notes,manager) 
				VALUES (
					'{$area['Area']['id']}',
					'{$area['Area']['name']}',
					'{$area['Area']['notes']}',
					'{$area['Area']['manager']}'
				)");

			$this->importShifts($area);
			$submitted = false;
		} else {
			// the request exists. has it been submitted?
			if ($area = $this->find('first',array('conditions' => array('RequestArea.id' => $id)))) {
				// display the submitted request
				$submitted = true;
			} else {
				$submitted = false;
			}
		}

		if ($force) $submitted = false;

		// get the data for display
		$this->contain('RequestShift.RequestAssignment');
		$area = $this->find('first',array(
			'conditions' => array('RequestArea.id' => $id * ($submitted ? 1 : -1))
		));

		$area['FloatingShift'] = array();

		$this->Person = ClassRegistry::init('Person');;
		$this->Person->schedule_id = $this->schedule_id;
		$this->Person->addAssignedPeople($area,'Request');
		return $area;
	}

	function importShifts($area) {		
		$shiftValues = '';
		$assignmentValues = '';

		// get the latest (smallest) RequestShift id and AssignmentShift id
		// so that we can make a new one that does not conflict
		// and then incriment (decriment, but it's negative) for each new one
		$smallestShiftId = $this->RequestShift->field('id',null,'id asc');
		$shiftId = $smallestShiftId > 0 ? -1 : $smallestShiftId - 1;
		$smallestAssignmentId = $this->RequestShift->RequestAssignment->field('id',null,'id asc');
		$assignmentId = $smallestAssignmentId > 0 ? -1 : $smallestAssignmentId - 1;

		foreach($area['Shift'] as &$shift) {
			$shift['id'] = $shiftId;
			$shift['request_area_id'] = $shift['area_id'] * -1;
			$shiftValues .= "(
				'{$shiftId}',
				'{$shift['request_area_id']}',
				'{$shift['day_id']}',
				'{$shift['start']}',
				'{$shift['end']}',
				'{$shift['num_people']}'
			),";
			foreach($shift['Assignment'] as $assignment) {
				$assignmentValues .= "(
					'{$assignmentId}',
					'{$assignment['person_id']}',
					'{$assignment['name']}',
					'{$shift['id']}'
				),";
				$assignmentId--;
			}
			$shiftId--;
		}
		$shiftValues = substr_replace($shiftValues,'',-1);
		$assignmentValues = substr_replace($assignmentValues,'',-1);
		$this->query("INSERT INTO request_shifts (id,request_area_id,day_id,start,end,num_people)
			VALUES {$shiftValues}");
		$this->query("INSERT INTO request_assignments (id,person_id,name,request_shift_id)
			VALUES {$assignmentValues}");
	}

	function submit($id) {
		// delete existing published area and related model records
		$publishId = $id * -1;
		$this->query("DELETE FROM request_areas WHERE id = {$publishId}");
		$this->query("DELETE FROM request_assignments WHERE request_shift_id IN
			(SELECT id from request_shifts where request_area_id = {$publishId})");
		$this->query("DELETE FROM request_shifts WHERE request_area_id = {$publishId}");
		
		// copy edited request (negative request_area_id) to publish (positive ids)
		$area = $this->find('first',array(
			'conditions' => array(
				'RequestArea.id' => $id
			),
			'contain' => array('RequestShift.RequestAssignment')
		));
		$area['RequestArea']['id'] = $area['RequestArea']['id'] * -1;
		$shiftValues = '';
		$assignmentValues = '';
		foreach($area['RequestShift'] as &$shift) {
			$shift['id'] = $shift['id'] * -1;
			$shift['request_area_id'] = $shift['request_area_id'] * -1;
			$shiftValues .= "(
				'{$shift['id']}',
				'{$shift['request_area_id']}',
				'{$shift['day_id']}',
				'{$shift['start']}',
				'{$shift['end']}',
				'{$shift['num_people']}'
			),";
			foreach($shift['RequestAssignment'] as $assignment) {
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
		$this->query("INSERT INTO request_areas (id,name,notes,manager) 
			VALUES (
				'{$area['RequestArea']['id']}',
				'{$area['RequestArea']['name']}',
				'{$area['RequestArea']['notes']}',
				'{$area['RequestArea']['manager']}'
			)");
		$this->query("INSERT INTO request_shifts (id,request_area_id,day_id,start,end,num_people)
			VALUES {$shiftValues}");
		$this->query("INSERT INTO request_assignments (id,person_id,name,request_shift_id)
			VALUES {$assignmentValues}");
	}

	function getList() {
		return $this->find('list',array(
			'conditions' => array('RequestArea.id >' => 0),
			'order' => 'RequestArea.name'
		));
	}

	function view($id, $submitted = true) {
		$this->contain('RequestShift.RequestAssignment');
		$area = $this->find('first',array(
			'conditions' => array('RequestArea.id' => $id * ($submitted ? 1 : -1))
		));

		$area['FloatingShift'] = array();

		$this->Person = ClassRegistry::init('Person');;
		$this->Person->schedule_id = $this->schedule_id;
		$this->Person->addAssignedPeople($area,'Request');
		return $area;
	}	

}
?>
