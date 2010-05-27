<?
class Schedule extends AppModel {

	var $name = 'Schedule';
	
	var $hasMany = array(
		'Hobby',
		'Job',
		'Person'
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
			if ($model == 'Schedule') {
				continue;
			}
			foreach($record as $data) {
				$data['schedule_id'] = $branch_id;
				$this->{$model}->forceSave($data);
			}
		}
		return $branch_id;
	}

	function deleteBranch($id) {
		$this->delete($id);
		$models = array_keys($this->hasMany);
		foreach($models as $model) {
			$this->{$model}->deleteAll(array(
				"{$model}.schedule_id" => $id
			),false,false);
		}
	}
	
}
?>