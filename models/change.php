<?php  

class Change extends AppModel { 

	var $name = 'Change'; 
	var $hasMany = array('ChangeField','ChangeModel');


	function timeSpent() {
		$this->recursive = -1;
		$this->order = 'created asc';
		$changes = $this->sFind('all');
		$time = array();
		$start = $changes[0]['Change']['created'];
		$last = $start;
		$seconds = 0;
		$total = 0;
		foreach($changes as $num => $change) {
			$difference = strtotime($change['Change']['created']) - strtotime($last);
			$is_idle = ($difference > 60 * 40); // has been 15 minutes
			$is_last = ($num + 1 == count($changes));
			if (!$is_idle) {
				$seconds += $difference;
				$total += $difference;
			}
			if ($is_idle or $is_last) {
				$time[] = array(
					'start' => $start,
					'end' => $is_last? $change['Change']['created'] : $last,
					'time' => sec2hms($seconds)
				);
				$start = $change['Change']['created'];
				$seconds = 0;
				$difference = 0;
			}
			$last = $change['Change']['created'];
		}
		$time['total'] = sec2hms($total);
		return $time;
	}

	function doUndo() { 
		if ($undo = $this->firstUndo()) {
			$this->applyChange($undo);
			return true; 
		} else { 
			return false; 
		} 
	} 

	function doRedo() {
		if ($redo = $this->firstRedo()) {
			$this->applyChange($redo);
			return true;
		} else {
			return false;
		}
	}

	function firstUndo() {
		$this->sContain('ChangeModel.ChangeField'); 
		return $this->sFind('first',array(
			'conditions' => array(
				'Change.undone' => 0
			),
			'order' => 'Change.created desc'
		));
	}

	function firstRedo() {
		$this->sContain('ChangeModel.ChangeField'); 
		return $this->sFind('first',array(
			'conditions' => array(
				'Change.undone' => 1
			),
			'order' => 'Change.created asc'
		));
	}

	function applyChange($data, $fromMerge = false) { 
		$direction = ($data['Change']['undone'] || $fromMerge)? 'redo' : 'undo';
		$field_val = ($direction == 'undo') ? 'field_old_val' : 'field_new_val';
		foreach ($data['ChangeModel'] as $model_num => $change_model) { 
			$model_data = Set::combine($change_model,  
				'ChangeField.{n}.field_key',  
				"ChangeField.{n}.{$field_val}" 
			);
			// now perform the action specified in the Change            
			$model = ClassRegistry::init($change_model['name']);
			// if it's not an update, then reverse the action if it's an undo.
			if ($change_model['action'] != 2) {
				$change_model['action'] ^= ($direction == 'undo') ? 1 : 0;
			}
			switch ($change_model['action']) {
				case 0: // delete
					$model->qDelete($change_model['record_id']);
					break;
				case 1: // create
					if (!$model->find('first',array( // in case of sloppy merge from user importing a conflict
						'conditions'=> array(
							"{$change_model['name']}.id" => $model_data['id'],
							"{$change_model['name']}.schedule_id" => $model_data['schedule_id']
						)
					))) 
					$model->qInsert($model_data);
					break;
				case 2: // update
					$update = array();
					foreach($model_data as $field => $value) {
						$update["{$model->name}.$field"] = "'{$value}'";
					}
					$model->updateAll($update, array(
						"{$model->name}.id"          => $model_data['id'],
						"{$model->name}.schedule_id" => $model_data['schedule_id']
					));
					break;
			} 
			if ($change_model['name'] == 'PeopleSchedules') {
				deleteCache('people');
			}
			if ($change_model['name'] == 'Day' || 
					$change_model['name'] == 'Slot' ||
					$change_model['name'] == 'Boundary') {
				deleteCache('bounds');
			}
		} 
		if (!$fromMerge) {
			$this->save(array('Change' => array(
				'id' => $data['Change']['id'],
				'undone' => ($direction == 'undo') ? 1 : 0
			)));
		}
		
	} 

	function getOldData($model_name, $id) { 
		$model =& ClassRegistry::init($model_name);
		$this->oldData = $model->find('first', 
			array ( 
				'conditions' => array (
					"{$model_name}.id"          => $id,
					"{$model_name}.schedule_id" => scheduleId()
				), 
				'recursive' => -1 
			) 
		);
	}             
	 
	function saveChange($action) {
		$model_name = key($this->newData);
		$fields = array_keys($this->newData[$model_name]);
		// if it's a create, get the last inserted id, otherwise get the oldData id
		$id = ($action == 1) ? 
			ClassRegistry::init($model_name)->getLastInsertId() : 
			$this->oldData[$model_name]['id'];
		if ($action != 0) {
			$this->newData[$model_name]['id'] = $id;
			if (!in_array('id',$fields)) $fields[] = 'id';
		}
		$this->save(array( 
			'Change' => array( 
				'description' => '',
				'schedule_id' => scheduleId()
			) 
		));
		$change_model_id = $this->ChangeModel->qInsert(array(
			'change_id'   => $this->id, 
			'name'        => $model_name, 
			'action'      => $action, 
			'record_id'   => $id,
			'schedule_id' => scheduleId()
		));
		foreach ($fields as $field_key) { 
			$this->ChangeField->qInsert(array(
				'change_id' => $this->id,
				'change_model_id' => $change_model_id,
				'field_key' => $field_key,
				'field_old_val' => $this->oldData[$model_name][$field_key],
				'field_new_val' => $this->newData[$model_name][$field_key],
				'schedule_id' => scheduleId()
			));
		}
	}     

	function clearHanging() { 
		$scheduleID = scheduleId();
		$redos = $this->sFind('all',array(
			'conditions' => array('Change.undone' => 1),
			'recursive' => -1,
			'fields' => array('Change.id')
		));
		$ids = '';
		foreach($redos as $redo) {
			$ids .= $redo['Change']['id'] . ',';
		}
		$ids = substr_replace($ids,'',-1);
		if ($ids) {
			$this->query("DELETE FROM changes 
				WHERE changes.id IN ({$ids}) AND changes.schedule_id = {$scheduleID}");
			$this->query("DELETE FROM change_models 
				WHERE change_models.change_id IN ({$ids}) AND change_models.schedule_id = {$scheduleID}");
			$this->query("DELETE FROM change_fields 
				WHERE change_fields.change_id IN ({$ids}) AND change_fields.schedule_id = {$scheduleID}");
		}
	}     

	function jumpTo($id) {
		$direction = 'redo';
		$distance = abs($id);
		if ($id >= 0) {
			$direction = 'undo';
			$distance++;
		}
		for($i = 1; $i <= $distance; $i++) {
			if ($direction == 'undo') {
				$this->doUndo();
			} else {
				$this->doRedo();
			}
		}
	}

	function getMessages() {
		return array(
			'undo' => $this->field('description',
				array(
					'Change.schedule_id' => scheduleId(),
					'Change.undone' => 0
				),
				'Change.created desc'
			),
			'redo' => $this->field('description',
				array(
					'Change.schedule_id' => scheduleId(),
					'Change.undone' => 1
				),
				'Change.created asc'
			)
		);
	}


} 
?>
