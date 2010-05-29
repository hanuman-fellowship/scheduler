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

	function newBranch($user_id, $parent_id) {
		$branch_data = array(
			'user_id'   => $user_id,
			'parent_id' => $parent_id,
		);
		$this->create();
		$this->save($branch_data);
		$branch_id = $this->id;
		$parent = $this->findById($parent_id);
		foreach($parent as $model => $record) {
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
	
}
?>