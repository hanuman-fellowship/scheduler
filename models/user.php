<?php
class User extends AppModel {

	var $name = 'User';
	
	var $hasMany = array(
		'Setting',
		'Role',
		'Manager'
	);

	function sSave($data) {
		$data['User']['password'] = Authsome::hash($data['User']['password']);
		foreach(array('operations','manager') as $role) {
			if ($data['User'][$role]) {
				$data['Role'][] = array(
					'name' => $role
				);
			}
		}
		if($data['User']['manager']) {
			foreach($data['User']['area_id'] as $area) {
				$data['Manager'][] = array(
					'area_id' => $area
				);
			}
		}
		return $this->saveAll($data);
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
				'password' => $data['User']['new_password']
			)
		));
		return true;
	}

}
?>
