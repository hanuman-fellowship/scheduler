<?
class Schedule extends AppModel {

	var $name = 'Schedule';
	
	var $hasMany = array(
		'Area',
		'Boundary',
		'ConstantShift',
		'Day',
		'FloatingShift',
		'OffDay',
		'Assignment',
		'PeopleSchedules',
		'ResidentCategory',
		'Slot',
		'Shift',
		'Change',
		'ChangeModel',
		'ChangeField'
	);

	var $belongsTo = array(
		'User',
		'ScheduleGroup'
	);

	var $conflicts = array();
	var $bypass = false;

	function valid($data) {
		$nameExists = $this->field('id',array('name' => $data['Schedule']['name']));
		if (isset($data['Schedule']['based_on'])) {
			if ($data['Schedule']['name'] == '') {
				$this->errorField = 'ScheduleName';
				$this->errorMessage = "Name must not be blank";
				return false;
			}	
			if ($nameExists) {
				$this->errorField = 'ScheduleName';
				$this->errorMessage = "That name already exists";
				return false;
			}
			return true;
		}
		$effective = isset($data['Schedule']['effective']);
		$publish = isset($data['Schedule']['group']); // true = publish; false = copy;
		if (isset($data['Schedule']['name'])) {
			if ($publish) {
				if ($data['Schedule']['group'] == 'update') {
					return true;
				}
				$nameExists = $this->ScheduleGroup->field('id',array('name' => $data['Schedule']['name']));
			}
			if ($data['Schedule']['name'] == '') {
				$this->errorField = 'name';
				$this->errorMessage = "Name must not be blank";
				return false;
			}	
			if ($nameExists) {
				$this->errorField = 'name';
				$this->errorMessage = "That name already exists";
				return false;
			}
		}
		if ($publish || $effective) {
			if (!strtotime($data['Schedule']['start'])) {
				$this->errorField = 'start';
				$this->errorMessage = "Invalid start date";
				return false;
			}	
			if (!strtotime($data['Schedule']['end'])) {
				$this->errorField = 'end';
				$this->errorMessage = "Invalid end date";
				return false;
			}	
			if (time() >= strtotime($data['Schedule']['end'])) {
				$this->errorField = 'end';
				$this->errorMessage = "Must not end in the past";
				return false;
			}
			if (strtotime($data['Schedule']['end']) <= strtotime($data['Schedule']['start'])) {
				$this->errorField = 'end';
				$this->errorMessage = "Start before end, please";
				return false;
			}	
		}
		return true;
	}

	function addRequest($area_id,$name,$schedule_id) {
		$original = $this->findById($schedule_id);
		$area = $this->Area->sFind('first',array(
			'conditions' => array(
				'Area.id' => $area_id
			)
		));
		$branch_data = array(
			'user_id'           => Authsome::get('id'),
			'name'              => "{$name} ({$area['Area']['short_name']} Request)",
			'request'           => 2
		);
		$this->create();
		$this->save($branch_data);
		$branch_id = $this->id;
		foreach($original as $model => $record) {
			switch ($model) {
				case 'Assignment':
				case 'Change':
				case 'ChangeModel':
				case 'ChangeField':
				case 'ConstantShift':
				case 'FloatingShift':
				case 'OffDay':
				case 'Schedule':
				case 'User':
				case 'ScheduleGroup':
					continue 2;
				case 'Area':
					foreach($record as $index => $data) {
						if ($data['id'] != $area_id) unset($record[$index]);
					}
					break;
				case 'Shift':
					foreach($record as $index => $data) {
						if ($data['area_id'] != $area_id) unset($record[$index]);
					}
					break;
				case 'PeopleSchedules' :
					if ($schedule_id != scheduleId()) { // we are copying a template
						// add the current people to the copy
						$this->contain('PeopleSchedules');
						$currentPeople = $this->findById(scheduleId());
						$record = $currentPeople['PeopleSchedules'];
					}
					break;
			}
			foreach($record as $data) {
				$data['schedule_id'] = $branch_id;
				$this->{$model}->qInsert($data);
			}
		}
		return $branch_id;
	}

	function listTemplates() {
		return $this->find('list',array(
			'conditions' => array(
				'schedule_group_id' => 0,
				'user_id' => 0
			),
			'order' => 'Schedule.name asc'
		));
	}

	function viewList() {
		$user_id = Authsome::get('id');
		$this->contain('User');
		$schedules = $this->find('all',array(
			'conditions' => array(
				'Schedule.user_id <>' => null,
				'Schedule.request' => 0
			),
			'order' => 'Schedule.user_id, Schedule.name'
		));

		$byUser = Set::combine($schedules,'{n}.Schedule.id','{n}','{n}.Schedule.user_id');
		$mine = isset($byUser[$user_id]) ? $byUser[$user_id] : array();
		return array(
			'mine' => $mine,
			'all' => $schedules
		);
	}

	function copy($schedule_id,$user_id, $name) {
		$original = $this->findById($schedule_id);
		if (is_null($original['Schedule']['parent_id'])) { // it has been published
			// make the old one the parent of the new one
			$parent_id = $schedule_id;
		} else { // it is a branch itself
			// give the new one the same parent
			$parent_id = $original['Schedule']['parent_id'];
		}
		$branch_data = array(
			'user_id'           => $user_id,
			'parent_id'         => $parent_id,
			'name'              => $name,
			'schedule_group_id' => $original['Schedule']['schedule_group_id']
		);
		$this->create();
		$this->save($branch_data);
		$branch_id = $this->id;
		foreach($original as $model => $record) {
			switch ($model) {
				case 'Schedule':
				case 'User':
				case 'ScheduleGroup':
					continue;
				case 'ChangeField':
					if ($schedule_id != scheduleId()) { // we are copying a template
						continue;
					}
					foreach($record as &$field_data) {
						if ($field_data['field_key'] == 'schedule_id') {
							if ($field_data['field_old_val'] != null) {
								$field_data['field_old_val'] = $branch_id;
							}
							if ($field_data['field_new_val'] != null) {
								$field_data['field_new_val'] = $branch_id;
							}
						}
					}
				case 'PeopleSchedules' :
					if ($schedule_id != scheduleId()) { // we are copying a template
						// add the current people to the copy
						$this->contain('PeopleSchedules');
						$currentPeople = $this->findById(scheduleId());
						$record = $currentPeople['PeopleSchedules'];
					}
				default:
					foreach($record as $data) {
						$data['schedule_id'] = $branch_id;
						$this->{$model}->qInsert($data);
					}
			}
		}
		return $branch_id;
	}

	function delete($id) {
		$this->id = $id;
		$parent_id = $this->field('parent_id');
		parent::delete();
		$models = array_keys($this->hasMany);
		foreach($models as $model) {
			$table = $this->{$model}->table;
			$this->{$model}->query("DELETE FROM {$table} WHERE {$table}.schedule_id = {$id}");
		}
		$this->User->Setting->deleteAll(array(
			'Setting.key' => 'auto_select',
			'Setting.val' => $id
		),false,false);
		return $parent_id;
	}
	
	/**
	 * Merge the branch passed into the current schedule
	 */
	function merge($id,$choices,$dry_run = false) {

		if ($choices) $this->bypass = true;
		$this->id = scheduleId();
		$my_parent = $this->field('parent_id');
		$this->id = $id;
		$merge_parent = $this->field('parent_id');
		
		if (!($my_parent == $merge_parent)) {
			return false;
		}

		// find what changes the user chose to remove and undo them
		if (!$dry_run) {
			foreach($choices as $key => $choice) {
				$parts = explode('_',$key);
				if ($parts[0] == 'remove') {
					if ($choice) {
						$removeMe = $parts[1];
						$this->Change->sContain('ChangeModel.ChangeField');
						$this->Change->applyChange(
							$this->Change->findById($removeMe)
						);
					}
				}
			}
			$this->Change->doQueue();
		}

		$sched_ids = array('a' => scheduleId(), 'b' => $id);

		// get all of the model data for both schedules and
		// separate them by schedule_id
		foreach($this->hasMany as $model => $assoc) {
			$data[$model] = $this->{$model}->find('all', array(
				'conditions' => array("{$model}.schedule_id" => array(scheduleId(), $id)),
				'recursive' => -1
			));
			$data[$model] = Set::combine($data[$model],
				"{n}.{$model}.id",
				"{n}.{$model}",
				"{n}.{$model}.schedule_id"
			);
			if ($data[$model] == array()){
				$data[$model] = array(
					scheduleId() => array(),
					$id => array()
				);
			}		
		}
				
		/*
		// find matching data and reference the ids from one schedule to another		
		foreach($data as $modelName => $schedules) {
			foreach($schedules[$sched_ids['a']] as $a_record_id => $a_data) {
				$a_data['id']          = null;
				$a_data['schedule_id'] = null;
				foreach($schedules[$sched_ids['b']] as $b_record_id => $b_data) {
					$b_data['id'] = null;
					$b_data['schedule_id'] = null;
					if(Set::diff($a_data,$b_data) == array()) {
						$data[$modelName][$sched_ids['b']][$b_record_id]['other_id'] = $a_record_id;
					}
				}
			}
		}
		*/
		
		// get the change data for each branch
		$this->Change = ClassRegistry::init('Change');		
		$scheduleID = scheduleId();
		foreach($sched_ids as $key => $sched_id) {
			$this->Change->id = '';
			setScheduleId($sched_id);
			$this->Change->sContain('ChangeModel.ChangeField');
			$changes[$key] = $this->Change->sFind('all',array(
				'conditions' => array(
					'Change.undone' => 0
				)
			));
		}
		setScheduleId($scheduleID);

		foreach($changes['b'] as $bKey => $b_change) {
			// get rid of changes that the user bypassed 
			if (array_key_exists($b_change['Change']['id'],$choices)) {
				if (!$choices[$b_change['Change']['id']]) {
					unset($changes['b'][$bKey]);
					continue;
				}
			}
			// get rid of changes that are identical (from a previous merge)
			foreach($changes['a'] as $aKey => $a_change) {
				if ($a_change['Change']['description'] == $b_change['Change']['description']
					&& $a_change['Change']['created'] == $b_change['Change']['created']) {
					unset($changes['a'][$aKey]);
					unset($changes['b'][$bKey]);
				}
			}
		}

		// modify the change data to be merged so that there are no conflicting ids
		$latest_ids = array();
		foreach($changes['b'] as &$b_change) {
			foreach($b_change['ChangeModel'] as &$b_change_model) {
				if ($b_change_model['action'] == 1) {
					if (isset($latest_ids[$b_change_model['name']])) {
						$latest_ids[$b_change_model['name']] ++;
					} else {
						if (isset($data[$b_change_model['name']][$sched_ids['a']])) {
							$ids = array_keys($data[$b_change_model['name']][$sched_ids['a']]);
							rsort($ids);
							$latest_ids[$b_change_model['name']] = $ids[0] + 1;
						} else {
							$latest_ids[$b_change_model['name']] = 1;
						}
					}
					$old_id = $b_change_model['record_id'];
					$b_change_model['record_id'] = $latest_ids[$b_change_model['name']];
					foreach($b_change_model['ChangeField'] as &$b_field) {
						if ($b_field['field_key'] == 'id') {
							$b_field['field_new_val'] = $latest_ids[$b_change_model['name']];
							$foreign_key = strtolower($b_change_model['name']) . '_id';
							foreach($changes['b'] as &$b_change_fk) {
								foreach($b_change_fk['ChangeModel'] as &$b_change_model_fk) {
									if ($b_change_fk['Change']['id'] < $b_change['Change']['id']) {
										foreach($b_change_model_fk['ChangeField'] as &$field_fk) {
											if ($field_fk['field_key'] == $foreign_key &&
											$field_fk['field_new_val'] == $old_id) {
												$field_fk['field_new_val'] = $latest_ids[$b_change_model['name']];
											}
										}
									}
								}
							}	
						}						
					}
				}
			}
		}
		
		// CONFLICT CHART //
		//                //
/*////

	In order to merge the b schedule into the a schedule,
	we have to compare the changes between two schedules.

	"my"            => the schedule being worked on.
	"your"          => the schedule chosen for the merge.

	Actions:

	0 = delete
	1 = create
	2 = update

			$conflict_chart = array(
				string $ifMyModel => array(
					int $doesThisAction => array(
						string $thenYourModel => array(int $cantDoThis[,int $orThis, int $orThis])
					)
				)
			);

  -----------

			The following EXAMPLE, There would be a conflict IF:
				
				my Area
					has been deleted AND
						your Shift (which is related to my Area) is
							deleted, created or updated,
					
			Likewise, this would also be a conflict:

				my Area
					has been deleted AND
						your FloatingShift (which is related to my Area) is
							deleted, created, or updated

			Also, further down in the chart, this would conflict:

				my Assignment
					has been created AND
						your Assignment, which has the same
							shift_id (as my Assignment) is
								deleted or updated
							


		$conflict_chart = array(
			'Area' => array(
				0 => array(
					'Shift' => array(0,1,2),
					'FloatingShift' => array(0,1,2)
				)
			)
			'Assignment' => array(
				0 => array(
					'Shift' => array(0,2)
				),
				1 => array(
					'Shift' => array(0,2),
					'Assignment' => array(
						'shift_id' => array(1)
					),
					'PeopleSchedules' => array(
						'person_id' => array(0)
					)
				)
			)
		);

*/////

		$conflict_chart = array(
			'Area' => array(
				0 => array(
					'Shift' => array(0,1,2),
					'FloatingShift' => array(0,1,2)
				)
			),
			'Assignment' => array(
				1 => array(
					'Shift' => array(0,2),
					'Assignment' => array(
						'shift_id' => array(1)
					),
					'PeopleSchedules' => array(
						'person_id' => array(0)
					)
				),
				2 => array(
					'Shift' => array(0,2)
				)
			),
			'FloatingShift' => array(
				1 => array(
					'Area' => array(0),
					'PeopleSchedules' => array(
						'person_id' => array(0)
					)
				),
				2 => array(
					'Area' => array(0),
					'PeopleSchedules' => array(
						'person_id' => array(0)
					)
				)
			),
			'Shift' => array(
				0 => array(
					'Assignment' => array(1,2)
				),
				2 => array(
					'Assignment' => array(1,2)
				)
			),
			'PeopleSchedules' => array(
				0 => array(
					'Assignment' => array(
						'person_id' => array(1,2)
					),
					'FloatingShift' => array(
						'person_id' => array(1,2)
					)
				)
			)
		);

		foreach($changes['a'] as $change0) {
			foreach($change0['ChangeModel'] as $change_model0) {
				foreach($changes['b'] as $change1) {
					foreach($change1['ChangeModel'] as $change_model1) {
						if($change_model0['name'] == $change_model1['name']
						&& $change_model0['record_id'] == $change_model1['record_id']) {
							$this->addConflict($change0,$change1);
							continue;
						}
						if (!in_array($change_model0['name'],array_keys($conflict_chart))) {
							continue 3; // this model is not listed as having conflicts
						}
						$chart_part = $conflict_chart[$change_model0['name']];
						if (!in_array($change_model0['action'],array_keys($chart_part))) {
							continue 3; // the action for this model is not listed as having conflicts
						}
						$chart_part = $chart_part[$change_model0['action']];
						if (!in_array($change_model1['name'],array_keys($chart_part))) {
							continue; // this model wouldn't conflict
						}
						$chart_part = $chart_part[$change_model1['name']];
						foreach($chart_part as $type_key => $type) {
							if(is_array($type)) {
								$fkey = $type_key;
								if(in_array($change_model1['action'],$type)) {
									foreach($change_model0['ChangeField'] as $field0) {
										foreach($change_model1['ChangeField'] as $field1) {
											if ($field0['field_key'] == $fkey
											&& $field1['field_key'] == $fkey) {
												$val = $field0['field_new_val'] ?
													$field0['field_new_val'] :
													$field0['field_old_val'];
												if ($val == $field1['field_new_val'] ||
												$val == $field1['field_old_val']) {
													$this->addConflict($change0,$change1);
													continue 5;
												}
											}
										}
									}
								}
							}
						}
						if (!in_array($change_model1['action'],$chart_part)) {
							continue; // this model action wouldn't conflict
						}
						// there is a potential for a conflict, so we check for foreign key matches
						foreach($change_model0['ChangeField'] as $field0) {
							if (
								$field0['field_key'] == Inflector::underscore($change_model1['name']).'_id'
							&&	(
									$field0['field_new_val'] == $change_model1['record_id']
								||	$field0['field_old_val'] == $change_model1['record_id']
								)
							) {
								$this->addConflict($change0,$change1);
								continue;
							}
						}
						foreach($change_model1['ChangeField'] as $field1) {
							if (
								$field1['field_key'] == Inflector::underscore($change_model0['name']).'_id'
							&&	(
									$field1['field_new_val'] == $change_model0['record_id']
								||	$field1['field_old_val'] == $change_model0['record_id']
								)
							) {
								$this->addConflict($change0,$change1);
							}
						}
					}
				}
			}
		}

		// copy changes
		if (!$this->conflicts && !$dry_run) {
			$this->Change->clearHanging();
			$descriptions = array();
			foreach($changes['b'] as $change) {
				unset($change['Change']['id']);
				$change['Change']['schedule_id'] = $sched_ids['a'];
				$this->Change->create();
				$toApply = array('Change' => $change['Change']);
				$descriptions[] = $change['Change']['description'];
				$this->Change->save($toApply);
				foreach($change['ChangeModel'] as $modelNum => $change_model) {
					$change_model_data = array('ChangeModel' => $change_model);
					$change_model_data['ChangeModel']['change_id']   = $this->Change->id;
					$change_model_data['ChangeModel']['schedule_id'] = $sched_ids['a'];
					unset($change_model_data['ChangeModel']['ChangeField']);
					unset($change_model_data['ChangeModel']['id']);
					$change_model_id = $this->Change->ChangeModel->qInsert($change_model_data);
					$toApply['ChangeModel'][$modelNum] = $change_model_data['ChangeModel'];
					foreach($change_model['ChangeField'] as $fieldNum => $field) {
						$field['change_id']       = $this->Change->id;
						$field['change_model_id'] = $change_model_id;
						$field['schedule_id']     = $sched_ids['a'];
						if ($field['field_key'] == 'schedule_id') {
							$field['field_old_val'] = $field['field_old_val'] ? $sched_ids['a'] : null;
							$field['field_new_val'] = $field['field_new_val'] ? $sched_ids['a'] : null;
						}
						$change_field_data = array('ChangeField' => $field);
						unset($change_field_data['ChangeField']['id']);
						$this->Change->ChangeField->qInsert($change_field_data);
						$toApply['ChangeModel'][$modelNum]['ChangeField'][$fieldNum] = $change_field_data['ChangeField'];
					}
				}
				$this->Change->applyChange($toApply,'fromMerge');
			}
			$this->Change->doQueue();
			return array('descriptions' => $descriptions);
		} else {
			$descriptions = Set::combine($changes['b'],'{n}.Change.id','{n}.Change.description');
			return array('conflicts' => $this->conflicts,'descriptions'=>$descriptions);
		}
	}

	function addConflict($change0, $change1) {
		if ($this->bypass) return;
		$conflict_key = array(
			'a'  => $change0['Change']['id'],
			'b'  => $change1['Change']['id']
		);
		$new_conflict = array(
			'a' => $change0['Change']['description'],
			'b' => $change1['Change']['description'],
		);
		$this->conflicts[$conflict_key['b']]['b'] = $new_conflict['b'];
		$this->conflicts[$conflict_key['b']]['conflicts'][$conflict_key['a']] = array('a' => $new_conflict['a']);
	}

	function updateEffective($data) {
		$this->ScheduleGroup->save(array(
			'ScheduleGroup' => array(
				'start' => date('Y-m-d H:i:s',strtotime($data['Schedule']['start'])),
				'end' => date('Y-m-d H:i:s',strtotime($data['Schedule']['end']))
			)
		));
		$this->updateAll(
			array('schedule_group_id' => $this->ScheduleGroup->id),
			array('Schedule.id' => scheduleId())
		);
	}

	function publish($data) {
		if ($data['Schedule']['group'] == 'new') {
			$this->ScheduleGroup->save(array(
				'ScheduleGroup' => array(
					'name' => $data['Schedule']['name'],
					'start' => date('Y-m-d H:i:s',strtotime($data['Schedule']['start'])),
					'end' => date('Y-m-d H:i:s',strtotime($data['Schedule']['end']))
				)
			));
			$this->save(array(
				'Schedule' => array(
					'id' => scheduleId(),
					'name' => 'Published',
					'user_id' => null,
					'parent_id' => null,
					'schedule_group_id' => $this->ScheduleGroup->id
				)
			));
		} else {
			$this->save(array(
				'Schedule' => array(
					'id' => scheduleId(),
					'name' => 'Published',
					'user_id' => null,
					'parent_id' => null
				)
			));
		}
		// delete any auto-select settings for this schedule
		$this->Setting = ClassRegistry::init('Setting');		
		$this->Setting->deleteAll(
			array(
				"Setting.key" => 'auto_select',
				'Setting.val' => scheduleId()
			),false,false
		);
		// delete changes for this schedule
		$models = array('Change','ChangeModel','ChangeField');
		foreach($models as $model) {
			$this->{$model}->deleteAll(
				array(
					"{$model}.schedule_id" => scheduleId()
				),false,false
			); 
		}
		return scheduleId();
	}

	function template($name) {
		$original = $this->findById(scheduleId());
		$new = array(
			'user_id'           => 0,
			'parent_id'         => 0,
			'name'              => $name,
			'schedule_group_id' => 0
		);
		$this->create();
		$this->save($new);
		$new_id = $this->id;
		foreach($original as $model => $record) {
			switch ($model) {
				case 'Schedule':
				case 'FloatingShift':
				case 'PeopleSchedules':
				case 'Assignment':
				case 'User':
				case 'ScheduleGroup':
				case 'OffDay':
				case 'Change':
				case 'ChangeModel':
				case 'ChangeField':
					continue;
				default:
					foreach($record as $data) {
						$data['schedule_id'] = $new_id;
						$this->{$model}->qInsert($data);
					}
			}
		}
	}


}
?>
