<?php
class ResidentCategory extends AppModel {

	var $name = 'ResidentCategory';

	var $hasMany = array(
		'ConstantShift',
		'Person'
	);

	function description($changes) {
		if (isset($changes['newData'])) {
			if ($changes['oldData']['id'] == '') {
				$desc = "New Category: {$changes['newData']['name']}";
			} else {
				$desc = "Category changed: ({$changes['oldData']['name']})";
				$listed = false;
				foreach($changes['newData'] as $field => $val) {
					if ($changes['newData'][$field] != $changes['oldData'][$field]) {
						switch ($field) {
							case 'name':
								$desc .= $listed ? ', ' : ' ';
								$desc .= 
									'name:'.$changes['newData']['name'];
								break;
							case 'color':
								$desc .= $listed ? ', ' : ' ';
								$desc .= 
									'color:'.$changes['newData']['color'];
								break;		
						}
						$listed = true;
					}
				}
			}
		} else {
			$desc = "Category deleted: {$changes['oldData']['name']}";
		}
		return $desc;
	}

}
?>
