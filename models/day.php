<?php
class Day extends AppModel {

	var $name = 'Day';

	var $hasMany = array(
		'Boundary'
	);

	function valid($data) {
		foreach($data['Day'] as $key => $value) {
			if ($key == 'number') {
				$number = $value;
				continue;
			}
			if (trim($value) == '' && $key <= $number) {
				$this->errorField = "Day{$key}";
				$this->errorMessage = "Day names must not be blank.";
				return false;
			}
		}
		return true;
	}

	function sSave($data) {
		$this->Shift = ClassRegistry::init('Shift');  
		$this->ConstantShift = ClassRegistry::init('ConstantShift');  
		foreach($data['Day'] as $key => $value) {
			if ($key == 'number') {
				$number = $value;
				continue;
			}
			$this->id = $key;
			parent::sSave(array(
				'Day' => array(
					'id' => $key,
					'name' => ($key <= $number) ? $value : ''
				)
			));
			if ($key > $number) {
				foreach(array('Shift','ConstantShift') as $model) {
					$this->{$model}->id = '';
					$records = $this->{$model}->sFind('all',array(
						'conditions' => array(
							"{$model}.day_id" => $key
						),
						'recursive' => -1,
						'fields' => array('id')
					));
					foreach($records as $record) {
						$this->{$model}->sDelete($record[$model]['id']);
					}
				}
			}
		}
		deleteCache('bounds');
		return "Days changed";
	}

	function getShortName($day_id) {
		$day = $this->sFind('first',array(
			'recursive' => -1,
			'conditions' => array(
				'Day.id' => $day_id
			),
			'fields' => array('Day.name')
		));
		return substr($day['Day']['name'],0,3);
	}
}
?>
