<?php
class Area extends AppModel {

	var $name = 'Area';

	var $hasMany = array(
		'FloatingShift',
		'Shift' => array(
			'order' => 'start, end'
		)
	);

	function getArea($id) {
		$this->id = $id;
		$this->Person = &$this->Shift->Assignment->Person;
		$this->sContain('Shift.Assignment','FloatingShift.Person.PeopleSchedules.ResidentCategory');
		$area = $this->sFind('first');
		if (isset($area['FloatingShift'])) {
			foreach($area['FloatingShift'] as &$floating_shift) {
				$this->Person->addDisplayName($floating_shift['Person']);
			}
		}
		$this->Person->addAssignedPeople($area);
		$this->RequestArea = ClassRegistry::init('RequestArea');
		$area['hasRequest'] = $this->RequestArea->field('id',array('RequestArea.id'=>$id)) ? true : false;
		return $area;
	}
	
	function clear($ids, $keep_shifts = false, $internal = false) {
		$areas = (!is_array($ids)) ?  array($ids) : $ids;
		$list = '';
		foreach($areas as $area_id) {
			$this->id = $area_id;
			$this->sContain('Shift','FloatingShift');
			$area = $this->sFind('first');
			foreach($area['Shift'] as $shift) {
				if ($keep_shifts) {
					$this->Shift->clear($shift['id']);
					
				} else {
					$this->Shift->sDelete($shift['id']);
				}
			}
			foreach($area['FloatingShift'] as $floatingShift) {
				$this->FloatingShift->sDelete($floatingShift['id']);
			}
			$list .= $area['Area']['short_name'] . ', ';	
		}
		$list = substr($list,0,-2);	
		$keep_shifts = $keep_shifts ? ' (shifts kept)' : '';
		return $internal ? $area['Area']['short_name'] :
			"Areas cleared{$keep_shifts}: {$list}";
	}

	function sSave($data) {
		if (isset($data['Area']['notes'])) {
			$data['Area']['notes'] = addslashes(trim($data['Area']['notes']));
		}
		return parent::sSave($data);
	}

	function sDelete($ids) {
		$areas = (!is_array($ids)) ?  array($ids) : $ids;
		$list = '';
		foreach($areas as $id) {
			$this->id = $id;
			$list .= $this->clear($id,false,true) . ', ';
			parent::sDelete($id);
		}
		$list = substr($list,0,-2);	
		return "Areas deleted:{$list}";
	}
	
	function description($changes) {
		if (!is_array($changes)) return $changes;
		if (isset($changes['newData'])) {
			if ($changes['oldData']['id'] == '') {
				$desc = "New area created: {$changes['newData']['name']}";
			} else {
				$desc = 'Area changed: '.
				"{$changes['oldData']['name']}";
				$listed = false;
				foreach($changes['newData'] as $field => $val) {
					if ($changes['newData'][$field] != $changes['oldData'][$field]) {
						$desc .= $listed ? ', ' : ' ';
						$desc .= 
							Inflector::humanize($field).':'.$val;
						$listed = true;
					}
				}
			}
		} else {
			$desc = "Area deleted: {$changes['name']}";
		}
		return $desc;
	}

	function getChanged($since = null) {
		$since = $since ? date('Y-m-d H:i:s',$since) : 0;
		$changed = array();
		$this->Change = ClassRegistry::init('Change');
		$this->Change->nudge(1); // so that the first one is not 0
		$this->Change->id = '';
		$this->Change->sContain('ChangeModel.ChangeField');
		$changes = $this->Change->sFind('all',array(
			'conditions' => array(
				'Change.id >=' => 1,
				'Change.created >=' => $since
			)
		));
		$this->Change->nudge(-1); // move them back
		foreach($changes as $change) {
			foreach($change['ChangeModel'] as $changeModel) {
				switch ($changeModel['name']) {
					case 'Area' :
						$changed[$changeModel['record_id']][$change['Change']['id']] = $change['Change']['description'];
						break;
					case 'Shift' :
					case 'FloatingShift' :
						foreach($changeModel['ChangeField'] as $changeField) {
							if ($changeField['field_key'] == 'area_id') {
								foreach(array('field_old_val','field_new_val') as $field) {
									if ($changeField[$field]) {
										$changed[$changeField[$field]][$change['Change']['id']] = $change['Change']['description'];
									}
								}
							}
						}
						break;
					case 'Assignment' :
						foreach($changeModel['ChangeField'] as $changeField) {
							if ($changeField['field_key'] == 'shift_id') {
								foreach(array('field_old_val','field_new_val') as $field) {
									if ($changeField[$field]) {
										if ($shift = $this->Shift->sFind('first',array(
											'recursive' => -1,
											'conditions' => array('Shift.id' => $changeField[$field]),
											'fields' => array('Shift.area_id')
										))) {
											$changed[$shift['Shift']['area_id']][$change['Change']['id']] = $change['Change']['description'];
										}
									}
								}
							}
						}
						break;
				}
			}
		}
		return $changed;
	}

}
?>
