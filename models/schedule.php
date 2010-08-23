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
		'User'
	);

	var $conflicts = array();

	function valid($data) {
		if ($data['Schedule']['name'] == '') {
			$this->errorField = 'name';
			$this->errorMessage = "Name must not be blank";
			return false;
		}	
		if ($this->field('id',array('name' => $data['Schedule']['name']))) {
			$this->errorField = 'name';
			$this->errorMessage = "That name already exists";
			return false;
		}
		return true;
	}

	function viewList() {
		$user_id = Authsome::get('id');
		$this->contain('User');
		$schedules = $this->find('all',array(
			'conditions' => array(
				'Schedule.user_id <>' => null 
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

	function copy($user_id, $name) {
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
				case 'User':
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
	function merge($id) {
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
		
		// get the change data for each branch
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

		// get rid of changes that are identical (probably from a previous merge)
		foreach($changes['b'] as $key => $b_change) {
			foreach($changes['a'] as $key => $a_change) {
				if ($a_change['Change']['description'] == $b_change['Change']['description']) {
					unset($changes['b'][$key]);
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
		
		// look for deletes or updates in b that a has made changes to and vice versa
		$conflicts = array();
		$a_and_b = array(
			array('a','b'),
			array('b','a')
		);
		
		/**
		 * conflict chart should be in this format:
		 * 	array(
		 * 		'ModelA' => array(
		 * 			'#' => array(   // # = 0,1,2 (delete, create, update)
		 *				'ModelB' => array(#,#,#) // actions on ModelB that would conflict with action of ModelA
		 *			),
		 *			'another #' => array(
		 *				'another ModelB' => array(#,#,#,
		 *					'subModel' => array(#,#,#) // optional sub model
		 *				)
		 *			)
		 *		)
		 *	)
		 *
		 * todo: how to handle, for example, I create an OffDay, and you assign someone on that day?
		 */
		$conflict_chart = array(
			'Area' => array(
				0 => array(
					'Shift' => array(0,1,2),
					'FloatingShift' => array(0,1,2)
				)
			),
			'Assignment' => array(
				1 => array(
					'Shift' => array(0,2)
				),
				2 => array(
					'Shift' => array(0,2)
				)
			),
			'FloatingShift' => array(
				1 => array(
					'Area' => array(0)
				),
				2 => array(
					'Area' => array(0)
				)
			),
			'Shift' => array(
				0 => array(
					'Assignment' => array(0,1,2)
				),
				2 => array(
					'Assignment' => array(0,1,2)
				)
			)
		);

//	foreach(array(array('a','b'),array('b','a')) as $ab) {
		$ab = array('a','b');
		foreach($changes[$ab[0]] as $change0) {
			foreach($change0['ChangeModel'] as $change_model0) {
				foreach($changes[$ab[1]] as $change1) {
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
							continue 2; // this model wouldn't conflict
						}
						if (!in_array($change_model1['action'],$chart_part[$change_model1['name']])) {
							continue 2; // this model action wouldn't conflict
						}
						// there is a potential for a conflict, so we check the ids
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
//	}



/*

//		debug($changes);
		foreach($a_and_b as $ab) {
			foreach($changes[$ab[0]] as $change0) {
				foreach($change0['ChangeModel'] as $change_model0) {
//					if ($change_model0['action'] != 1) {

						$foreign_keys = array();
						foreach($change_model0['ChangeField'] as $field0) {
							if ($field0['field_key'] != 'schedule_id' && substr($field0['field_key'],-3) == '_id') {
								$val = ($field0['field_new_val'] == '') ? 
									$field0['field_old_val'] : $field0['field_new_val'];	
								$foreign_keys[$change_model0['id']][$field0['field_key']] = $val;
								//Inflector::humanize(array_shift(explode('_id',$field0['field_key'],2)))
							}
						}
						$foreign_key = strtolower($change_model0['name']) . '_id';
						foreach($changes[$ab[1]] as $change1) {
							$conflict = '';
							foreach($change1['ChangeModel'] as $change_model1) {
								if ($change_model1['name'] == $change_model0['name'] &&
								$change_model1['record_id'] == $change_model0['record_id']) {
									$conflict = 'a and b are operating on the same thing';
								}
								foreach($change_model1['ChangeField'] as $field1) {
									if ($field1['field_key'] == $foreign_key &&
									($field1['field_new_val'] == $change_model0['record_id'] ||
									$field1['field_old_val'] == $change_model0['record_id'])) {
										$conflict = "{$ab[1]} relates to {$ab[0]}";
									}
									foreach($foreign_keys as $foreign_fields) {
										if (array_key_exists($field1['field_key'],$foreign_fields)) {
											if ($foreign_fields[$field1['field_key']] == $field1['field_new_val'] ||
											$foreign_fields[$field1['field_key']] == $field1['field_old_val']) {
												if ($conflict == '') { // in case they are the same thing, that's more accurate
													$conflict = 'a and b relate to a common thing';
												}
											} else {
												$conflict = '';
											}
										}
									}											
								}		
							}
							if ($conflict != '') {
								$conflict_key = array(
									$ab[0] => $change0['Change']['id'],
									$ab[1] => $change1['Change']['id']
								);
								$new_conflict = array(
									$ab[1] => $change1['Change']['description'],
									$ab[0] => $change0['Change']['description'],
									'why'  => $conflict
								);
								$conflicts[$conflict_key['a']]['a'] = $new_conflict['a'];
								$conflicts[$conflict_key['a']]['conflicts'][$conflict_key['b']] = array('b' => $new_conflict['b'],'why' => $new_conflict['why']);
//								ksort($conflicts[$conflict_key['a'].'_'.$conflict_key['b']]);
							}
						}
//					}
				}
			}
		}
		
*/	
		debug($this->conflicts);
		die;
		// save changes from b as redos for a
		if (!$conflicts) {
			$new_change_id = 0;		
			foreach($changes['b'] as $change) {
				$new_change_id --;
				$change['Change']['id']          = $new_change_id;
				$change['Change']['schedule_id'] = $sched_ids['a'];
				$this->Change->create();
				$this->Change->save(array('Change' => $change['Change']));
				foreach($change['ChangeModel'] as $change_model) {
					$change_model_data = array('ChangeModel' => $change_model);
					$change_model_data['ChangeModel']['change_id']   = $new_change_id;
					$change_model_data['ChangeModel']['schedule_id'] = $sched_ids['a'];
					unset($change_model_data['ChangeModel']['ChangeField']);
					unset($change_model_data['ChangeModel']['id']);
					$this->Change->ChangeModel->create();
					$this->Change->ChangeModel->save($change_model_data);
					$change_model_id = $this->Change->ChangeModel->getLastInsertId();
					foreach($change_model['ChangeField'] as $field) {
						$field['change_id']       = $new_change_id;
						$field['change_model_id'] = $change_model_id;
						$field['schedule_id']     = $sched_ids['a'];
						if ($field['field_key'] == 'schedule_id') {
							$field['field_old_val'] = $field['field_old_val'] ? $sched_ids['a'] : null;
							$field['field_new_val'] = $field['field_new_val'] ? $sched_ids['a'] : null;
						}
						$change_field_data = array('ChangeField' => $field);
						unset($change_field_data['ChangeField']['id']);
						$this->Change->ChangeField->create();
						$this->Change->ChangeField->save($change_field_data);
					}
				}
			}
			// apply all the new changes
			$this->Change->schedule_id = $this->schedule_id;
			while($this->Change->doRedo()) {
			}
		} else {
			echo 'Conflicts merging b into a<br><br>';
			debug($conflicts);
		}
	}

	function addConflict($change0, $change1) {
		$conflict_key = array(
			'a'  => $change0['Change']['id'],
			'b'  => $change1['Change']['id']
		);
		$new_conflict = array(
			'a' => $change0['Change']['description'],
			'b' => $change1['Change']['description'],
		);
		$this->conflicts[$conflict_key['a']]['a'] = $new_conflict['a'];
		$this->conflicts[$conflict_key['a']]['conflicts'][$conflict_key['b']] = array('b' => $new_conflict['b']);
	}

	function publish() {
		$this->save(array(
			'Schedule' => array(
				'id' => $this->schedule_id,
				'name' => 'Published',
				'user_id' => null,
				'parent_id' => null
			)
		));
		$models = array('Change','ChangeModel','ChangeField');
		foreach($models as $model) {
			$this->{$model}->deleteAll(
				array(
					"{$model}.schedule_id" => $this->schedule_id
				),false,false
			); 
		}
		return $this->schedule_id;
	}
}
?>
