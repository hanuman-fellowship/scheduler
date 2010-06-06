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
		'Person',
		'ResidentCategory',
		'Slot',
		'Shift',
		'Change',
		'ChangeModel',
		'ChangeField'
	);

	function newBranch($user_id, $name) {
		$old_parent_id = $this->field('parent_id', array('id' => $this->schedule_id));
		if (is_null($old_parent_id)) { // it has been published
			// make the old one the parent of the new one
			$parent_id = $this->schedule_id;
		} else { // it is a branch itself
			// give the new one the same parent
			$parent_id = $this->field('parent_id', array('id' => $this->schedule_id));
		}
		$branch_data = array(
			'user_id'   => $user_id,
			'parent_id' => $parent_id,
			'name'      => $name
		);
		$this->create();
		$this->save($branch_data);
		$branch_id = $this->id;
		$original = $this->findById($this->schedule_id);
		foreach($original as $model => $record) {
			switch ($model) {
				case 'Schedule':
					continue;
				case 'ChangeField':
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
				default:
					foreach($record as $data) {
						$data['schedule_id'] = $branch_id;
						$this->{$model}->forceSave($data);
					}
			}
		}
		return $branch_id;
	}

	function deleteBranch($id) {
		$this->id = $id;
		$parent_id = $this->field('parent_id');
		$this->delete();
		$models = array_keys($this->hasMany);
		foreach($models as $model) {
			$this->{$model}->deleteAll(array(
				"{$model}.schedule_id" => $id
			),false,false);
		}
		return $parent_id;
	}
	
	/**
	 * Merge the branch passed into the current schedule
	 */
	function mergeBranch($id) {
		// Todo: add a check that the schedule is not published.

		$this->id = $this->schedule_id;
		$my_parent = $this->field('parent_id');
		$this->id = $id;
		$merge_parent = $this->field('parent_id');
		
		if (!($my_parent == $merge_parent)) {
			return false;
		}

		$sched_ids = array('a' => $this->schedule_id, 'b' => $id);

		// get all of the model data for both schedules and
		// separate them by schedule_id
		foreach($this->hasMany as $model => $assoc) {
			$data[$model] = $this->{$model}->find('all', array(
				'conditions' => array("{$model}.schedule_id" => array($this->schedule_id, $id)),
				'recursive' => -1
			));
			$data[$model] = Set::combine($data[$model],
				"{n}.{$model}.id",
				"{n}.{$model}",
				"{n}.{$model}.schedule_id"
			);
			if ($data[$model] == array()){
				$data[$model] = array(
					$this->schedule_id => array(),
					$id => array()
				);
			}		
		}
				
		// find matching data and reference the ids from one schedule to another		
		/*
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
		

		$this->Change = ClassRegistry::init('Change');		
		foreach($sched_ids as $key => $sched_id) {
			$this->Change->id = '';
			$this->Change->schedule_id = $sched_id;	
			$this->Change->clearHanging(); // get rid of redos
			$this->Change->nudge(1); // move the ids up so that the first record is not 0
			$this->Change->sContain('ChangeModel.ChangeField');
			$changes[$key] = $this->Change->sFind('all');
			$this->Change->nudge(-1); // move the ids back
		}
		debug($changes);
		$latest_ids = array();
		foreach($changes['b'] as &$b_change) {
			foreach($b_change['ChangeModel'] as &$b_change_model) {
				if ($b_change_model['action'] == 1) {
					if (isset($latest_ids[$b_change_model['name']])) {
						$latest_ids[$b_change_model['name']] ++;
					} else {
						$ids = array_keys($data[$b_change_model['name']][$sched_ids['a']]);
						rsort($ids);
						$latest_ids[$b_change_model['name']] = $ids[0] + 1;
					}
					foreach($b_change_model['ChangeField'] as &$field) {
						if ($field['field_key'] == 'id') {
							$old_id = $field['field_new_val'];
							$field['field_new_val'] = $latest_ids[$b_change_model['name']];
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
		debug($changes);

		$changeFields = $this->Change->ChangeModel->ChangeField->find('all', array(
			'conditions' => array('ChangeField.schedule_id' => array($this->schedule_id, $id)),
			'recursive' => -1
		));

		$changeFields = Set::combine($changeFields,"{n}.ChangeField.id","{n}.ChangeField","{n}.ChangeField.schedule_id");
		foreach($changeFields as &$schedule) {
			$schedule = Set::combine($schedule,"{n}.id","{n}","{n}.change_model_id");
			foreach($schedule as &$field_changes) {
				foreach($field_changes as &$field_data) {
					unset($field_data['schedule_id']);
				}
			}
		}
		$my_fields = $changeFields[$this->id];
		$other_fields = $changeFields[$id];
//		debug(Set::merge($my_fields,$other_fields));
		foreach($my_fields as $change_model_id => $field_changes) {
		//	$diffs[$change_model_id] = 
			//debug(Set::pushDiff($field_changes,$other_fields[$change_model_id]));
		}
//		debug($my_fields);
//		debug($other_fields);
//		debug(Set::pushDiff($my_fields,$other_fields));

		$changeModels = $this->Change->ChangeModel->find('all', array(
			'conditions' => array('ChangeModel.schedule_id' => array($this->schedule_id, $id)),
			'recursive' => -1
		));
		$changeModels = Set::combine($changeModels,"{n}.ChangeModel.id","{n}.ChangeModel","{n}.ChangeModel.schedule_id");
		foreach($changeModels as &$schedule) {
			$schedule = Set::combine($schedule,"{n}.id","{n}","{n}.name");
			foreach($schedule as &$model_changes) {
				foreach($model_changes as &$change_data) {
					unset($change_data['schedule_id']);
				}
				$model_changes = Set::combine($model_changes,"{n}.id","{n}","{n}.record_id");
			}
		}
//		debug($changeModels);
		$my_changes    = $changeModels[$this->id];
		$other_changes = $changeModels[$id];

//		debug($my_changes);
//		debug($other_changes);
//		debug(Set::merge($my_changes,$other_changes));

		foreach($other_changes as $model => $records) {
			if (!array_key_exists($model,$my_changes)) {
				continue;
			}
			foreach($records as $record_id => $changes) {
				if (!array_key_exists($record_id,$my_changes[$model])) {
					continue;
				}
//				debug($model);
//				debug($record_id);
//				debug($my_changes[$model][$record_id]);
//				debug($other_changes[$model][$record_id]);
//				debug(Set::pushDiff($my_changes[$model][$record_id],$other_changes[$model][$record_id]));
			}
		}
		
		
	}
	
}
?>