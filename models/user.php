<?php
class User extends AppModel {

	var $name = 'User';

	var $displayField = 'username';
	
	var $hasMany = array(
		'Setting',
		'Role',
		'Manager',
		'Schedule'
	);

	function valid($data) {
		if (!isset($data['User']['id']) && 
		$this->field('id',array('username'=>$data['User']['username']))) {
			$this->errorField = 'username';
			$this->errorMessage = "That username is taken";
			return false;
		}	
		foreach($data['User'] as $name => $value) {
			if ($name == 'area_id') {
				if ($data['User']['manager']) {
					if ($value == '') {
						$this->errorField = $name;
						$this->errorMessage = "Please choose an area";
						return false;
					}
				}
			} else {
				if ($value == '' && !in_array($name,array('operations','manager'))) {
					$this->errorField = $name;
					$this->errorMessage = Inflector::humanize($name)." must not be blank.";
					return false;
				}
			}
		}
		return true;
	}

	function sSave($data) {
		if (isset($data['User']['password'])) {
			$data['User']['password'] = Authsome::hash($data['User']['password']);
		}
		$id = isset($data['User']['id']) ? $data['User']['id'] : '';
		$deleteRoles = array();
		foreach(array('operations','manager') as $role) {
			if ($data['User'][$role]) {
				if (!$this->Role->field('id',array(
					'Role.name' => $role,
					'Role.user_id' => $id 
				))) {
					$data['Role'][] = array(
						'name' => $role
					);
				}
			} else {
				$deleteRoles[] = $role;
			}
		}
		$this->Role->deleteAll(array(
			'name' => $deleteRoles,
			'user_id' => $id 
		));
		if($data['User']['manager']) {
			foreach($data['User']['area_id'] as $area) {
				$data['Manager'][] = array(
					'area_id' => $area
				);
			}
		}
		$this->Manager->deleteAll(array(
			'NOT' => array (
				'area_id' => $data['User']['area_id']
			)
		));
		$this->saveAll($data);
	}

	function edit($id) {
		$this->contain('Manager','Role');
		$data = $this->find('first',array('conditions'=>array("User.id" => $id)));
		$data['User']['manager'] = 0;
		$data['User']['operations'] = 0;
		foreach($data['Role'] as $role) {
			$data['User'][$role['name']] = 1;
		}
		foreach($data['Manager'] as $manager) {
			$data['User']['area_id'][] = $manager['area_id'];
		}
		return $data;
	}

	function sDelete($id) {
		foreach($this->hasMany as $model) {
			if ($model['className'] == 'Schedule') {
				$schedules = $this->Schedule->find('all', array(
					'conditions' => array(
						'Schedule.user_id' => $id
					),
					'recursive' => -1,
					'fields' => array('id')
				));
				foreach($schedules as $schedule) {
					$this->Schedule->delete($schedule['Schedule']['id']);
				}
			} else {
				$this->{$model['className']}->deleteAll(array(
					"{$model['className']}.user_id" => $id
				));
			}
		}
		$this->delete($id);
	}

    public function authsomeLogin($type, $credentials = array()) {
        switch ($type) {
            case 'guest':
                // You can return any non-null value here, if you don't
                // have a guest account, just return an empty array
                return array();
            case 'credentials':
                $password = Authsome::hash($credentials['password']);

                // This is the logic for validating the login
                $conditions = array(
                    'User.username' => $credentials['username'],
                    'User.password' => $password,
                );
                break;
			case 'update':
				// if something has changed, re-login user without authenticating
				$conditions = array(
					'User.id' => Authsome::get('id')
				);
				break;
            default:
                return null;
        }

        return $this->find('first', compact('conditions'));
    }
	
	function changePassword($data) {
		if(Authsome::hash($data['User']['old_password']) != Authsome::get('password')) {
			$this->errorMessage = 'Incorrect Password';
			$this->errorField = 'old_password';
			return false;
		}
		if($data['User']['new_password'] != $data['User']['retype']) {
			$this->errorMessage = 'Passwords do not match';
			$this->errorField = 'new_password';
			return false;
		}	
		if($data['User']['new_password'] == '') {
			$this->errorMessage = 'Please enter a new password';
			$this->errorField = 'new_password';
			return false;
		}	
		$this->save(array(
			'User' => array(
				'id' => Authsome::get('id'),
				'password' => Authsome::hash($data['User']['new_password'])
			)
		));
		return true;
	}

}
?>
