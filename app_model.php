<?php
class AppModel extends Model {
	var $actsAs = array('Containable');
	var $schedule_id;
	
	function sContain() {
		$args = func_get_args();
		foreach($args as &$arg) {
			$arg .= '.schedule_id = ' . $this->schedule_id;
		}
		$this->contain($args);
	}
	
	function sFind($type, $params = array()) {
		if ($this->name != 'Schedule') {
			if (array_key_exists('contain', $params)) {
				foreach($params['contain'] as &$contain) {
					$contain .= '.schedule_id = ' . $this->schedule_id;
				}
			}
			$params = array_merge_recursive(
				$params,
				array(
					'conditions' => array(
						"{$this->name}.schedule_id" => $this->schedule_id
					)
				)
			);
			if (isset($this->id)) {
				$params['conditions']["{$this->name}.id"] = $this->id;
			}		
		}
		return $this->find($type, $params);
	}
	
	function sSave($data) {
		// first prepare the data to be recorded in the Change models.
		$this->Change =& ClassRegistry::init('Change');  
		$fields =& $data[$this->name];
		$create = !array_key_exists('id', $fields);
		// now add the schedule_id
		$fields['schedule_id'] = $this->schedule_id;	
		// if it's an update, get the old data
		if (!$create) { 
			$this->Change->getOldData($this->name, $fields['id']); 
		} else {
			$this->Change->oldData = array(
				"{$this->name}" => array_fill_keys(array_keys($fields),null)
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
				"{$this->name}.schedule_id" => $this->schedule_id
			));
		}
		// save the Change
		$this->Change->newData = $data;
		$this->Change->saveChange(($create xor 1) + 1); // 1 for create or 2 for update 
		return true;
	}
	
	function sDelete($id) {
		$this->Change =& ClassRegistry::init('Change');  
		$this->Change->getOldData($this->name,$id);
		$this->Change->newData = array(
			"{$this->name}" => array_fill_keys(array_keys($this->Change->oldData[$this->name]),null)
		);
		$this->Change->saveChange(0); // 0 for delete 	
		if ($this->deleteAll(array(
			"{$this->name}.id"          => $id,
			"{$this->name}.schedule_id" => $this->schedule_id
		),false,false)) {
			return true;
		}
	}
	
	/**
	 * cake automatically does an update if the id exists, and we
	 * want a new record with the same id and a different schedule id
	 * so we force cake to do an insert by making the id -1, then
	 * we change the id to what it should be.
	 */
	function forceSave($data) {
		$real_id = $data['id'];
		$data['id'] = -1;
		$this->create(); 
		$this->save($data);
		$data = array("{$this->name}.id" => $real_id);
		$this->updateAll($data, array("{$this->name}.id" => -1));               	
	}
		
}
?>