<?php
class AppModel extends Model {
	var $actsAs = array('Containable');

	function sContain() {
		$args = func_get_args();
		$new_args = array();
		foreach($args as &$arg) {
			$models = explode('.', $arg);
			$arg = array();
			$next_arg =& $arg;
			foreach($models as $model) {
				$next_arg[$model] = array(
					'conditions' => array(
						"{$model}.schedule_id =" => scheduleId()
					)
				);
				if ($model == 'Person') {
					unset($next_arg[$model]['conditions']);
				}
				$next_arg =& $next_arg[$model];
			}
			$new_args = array_merge($new_args, $arg);
		}
		$this->contain($new_args);
	}
	
	function sFind($type, $params = array()) {
		if ($this->name != 'Schedule') {
			if (array_key_exists('contain', $params)) {
				foreach($params['contain'] as &$contain) {
					$contain .= '.schedule_id = ' . scheduleId();
				}
			}
			$params = array_merge_recursive(
				$params,
				array(
					'conditions' => array(
						"{$this->name}.schedule_id" => scheduleId()
					)
				)
			);
			if (strlen($this->id) != 0 && $type != 'list') {
				$params['conditions']["{$this->name}.id"] = $this->id;
			}		
		}
		return $this->find($type, $params);
	}
	
	function sSave($data) {
		$fields =& $data[$this->name];
		$create = !array_key_exists('id', $fields);
		// now add the schedule_id
		$fields['schedule_id'] = scheduleId();

		// prepare data for saving the Change
		$this->Change =& ClassRegistry::init('Change');  
		// if it's an update, get the old data
		if (!$create) { 
			$this->Change->getOldData($this->name, $fields['id']); 
		} else {
			$this->Change->oldData = array(
				"{$this->name}" => $this->array_fill_keys(array_keys($fields),null)
			);
			$this->Change->oldData[$this->name]['id'] = null;
		}
		
		// save the data
		if ($create) {
			$this->create(); 
			$this->save($data);
		} else {
			// format the data for saveAll (add model name to keys and manually escape values)
			$update = array();
			foreach($fields as $field => $value) {
				$update["{$this->name}.$field"] = "'{$value}'";
			}
			// add a condition for the schedule_id and do the update
			$this->updateAll($update, array(
				"{$this->name}.id"          => $fields['id'],
				"{$this->name}.schedule_id" => scheduleId()
			));
		}
		
		// save the Change
		$this->Change->newData = $data;
		$this->Change->saveChange(($create xor 1) + 1); // 1 for create or 2 for update

		// create description
		
		return array(
			'newData' => $data[$this->name],
			'oldData' => $this->Change->oldData[$this->name]
		);
	}
	
	function sDelete($id) {
		// save the change
		$this->Change =& ClassRegistry::init('Change');  
		$this->Change->getOldData($this->name,$id);
		$this->Change->newData = array(
			"{$this->name}" => $this->array_fill_keys(array_keys($this->Change->oldData[$this->name]),null)
		);
		$this->Change->saveChange(0); // 0 for delete

		// delete the record
		$this->qDelete($id);
		return $this->Change->oldData[$this->name];
	}

	function qInsert($data) {
		if (isset($data[$this->name])) {
			$data = $data[$this->name];
		}
		if (array_key_exists('id',$data)) {
			$id = null;
		} else {
			if (!$existing = getInsertId($this->name)) {
				$id = $this->field('id',null,'id desc') + 1;
			} else {
				$id = $existing + 1;
			}
		}
		return(qInsertAdd($this->name,$data,$id));
	}

	function qDelete($id) {
		qDeleteAdd($this->name,$id);
	}

	function doQueue() {
		$queue = getQueue();
		if (is_array($queue['insert'])) {
			foreach($queue['insert'] as $model => $data) {
				$table = Inflector::tableize($model);
				$fields = '';
				foreach(array_keys($data[0]) as $field) {
					$fields .= $field.','; 
				}
				$fields = substr_replace($fields,'',-1);
				$values = '';
				foreach($data as $row) {
					$values .= '(';
					foreach($row as $value) {
						$values .= "'{$value}',";
					}
					$values = substr_replace($values,'',-1);
					$values .= '),';
				}
				$values = substr_replace($values,'',-1);
				$this->query("INSERT into {$table} ({$fields}) VALUES {$values}");
			}
		}
		if (is_array($queue['delete'])) {
			foreach($queue['delete'] as $model => $ids) {
				$table = Inflector::tableize($model);
				$values = '';
				foreach($ids as $id) {
					$values .= "'{$id}',";
				}
				$values = substr_replace($values,'',-1);
				$scheduleID = scheduleId();
				$this->query("DELETE FROM {$table} WHERE 
					{$table}.schedule_id = '{$scheduleID}' and {$table}.id IN ({$values})");
			}
		}
	}

	function forceSave($data) {
		$keys = "schedule_id";
		$values = "'{$data['schedule_id']}'";
		unset($data['schedule_id']);
		foreach($data as $key => $val) {
			$keys .= ",{$key}";
			$values .= ",'{$val}'";
		}
		$this->query("INSERT INTO {$this->table} ({$keys}) VALUES ({$values})");
	}
	
	function valid($data) {
		foreach($data[$this->name] as $name => $value) {
			if (trim($value) == '') {
				$this->errorField = $name;
				$this->errorMessage = Inflector::humanize($name)." must not be blank.";
				return false;
			}
		}
		return true;
	}
		
	function dbTime($time) {
		return  date('H:i:00',
			strtotime(
				$time['hour'].":".
				sprintf("%02d",$time['min'])." ".
				$time['meridian']
			)
		);
	}
		
	function array_fill_keys($keys, $value) {
		return array_combine($keys,array_fill(0,count($keys),$value));	
	}
}
?>
