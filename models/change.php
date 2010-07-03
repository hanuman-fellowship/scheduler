<?php  
/**
 * Track Changes - Change Model class file
 *
 * Saves, manages, and performs changes (including undo and redo).
 *
 * The ids of the this model (and the foreign keys to this model)
 * are dynamic. 0 represents the latest change,
 * while positive ids represent increasingly older changes. The nudge()
 * method is used to change all of the ids by 1 when a new change is created,
 * or when a change is undone or redone.
 *
 * When an change is undone, the ids are all decremented, thus the change
 * just performed becomes -1, and the next possible change to undo (if it exists)
 * becomes 0. Negative ids are changes to be redone.
 *
 * When a change is redone, the ids are all incremented, thus the change
 * just performed becomes 0 (which makes it the next possible change to undo),
 * and the next change to redo (if it exists) becomes -1.
 * 
 * The applyChange() method always retrieves change data at id -1
 * (there are database issues with interacting with id 0)
 * so when undoing a change the ids are nudged down before
 * geting the data, and when redoing a change the ids are nudged up
 * after getting the data. In this way, the id being used is always -1.
 *
 * @author Jason Galuten <jason@galuten.com>
 * @copyright Copyright (c) 2010, Jason Galuten
 * @version 0.1
 */
class Change extends AppModel { 

    var $name = 'Change'; 
    var $hasMany = array('ChangeField','ChangeModel');
    var $id = 0; // the current change is always 0 
    
    /**
     * Do Undo
     * 
     * If there is an id 0 then there is a change to be undone. First nudge
     * the ids down (data in this model is always retrieved at id -1),
     * then get and apply the change.
     * 
     * Return false if there is no change to undo.
     */
    function doUndo() { 
    	$this->id = 0;
        if ($this->sFind('first')) { // is there an undo? (if so, the id would be 0)
            $this->nudge(-1); // decrement undo tables ids so the next undo will be 0 
            $this->applyChange('undo'); // read the change and apply it to the database 
            return true; 
        } else { 
            return false; 
        } 
    } 
 
    /**
     * Do Redo
     * 
     * If there is an id -1 then there is a change to redo. Get and apply
     * the change and then nudge the ids up (so that the change is
     * undoable at id 0, etc,)
     * 
     * Return false if there is no change to redo.
     */    
    function doRedo() {
		$this->id = -1;
        if ($this->sFind('first')) { // is there a change to redo? (redoable changes are always negative) 
            $this->applyChange('redo'); 
            $this->nudge(1);             
            return true; 
        } else { 
            return false; 
        } 
    } 

    function applyChange($direction) { 
        // for undo, the nudge happens before this function, for redo it's after 
        // so that either way the table id we use is -1 
        $this->id = -1;  
        $field_val = ($direction == 'undo') ? 'field_old_val' : 'field_new_val';
        $this->sContain('ChangeModel.ChangeField'); 
        $data = $this->sFind('first');
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
					$model->deleteAll(array(
						"{$model->name}.id"          => $change_model['record_id'],
						"{$model->name}.schedule_id" => $this->schedule_id
					),false,false);
                	break;
                case 1: // create
                	$model->forceSave($model_data);
                	break;
                case 2: // update
                	foreach($model_data as $field => $value) {
               			$update["{$model->name}.$field"] = "'{$value}'";
               		}
                	$model->updateAll($update, array(
                		"{$model->name}.id"          => $model_data['id'],
                		"{$model->name}.schedule_id" => $model_data['schedule_id']
                	));
                	break;
            } 
        } 
    } 


    function getOldData($model_name, $id) { 
    	$model =& ClassRegistry::init($model_name);
        $this->oldData = $model->find('first', 
			array ( 
				'conditions' => array (
					"{$model_name}.id"          => $id,
					"{$model_name}.schedule_id" => $model->schedule_id
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
			$fields[] = 'id';
		}
		$change_model_data = array(
			'ChangeModel' => array(
				'change_id'   => 0, 
				'name'        => $model_name, 
				'action'      => $action, 
				'record_id'   => $id,
				'schedule_id' => $this->schedule_id
			)
		); 
		$this->ChangeModel->create(); 
		$this->ChangeModel->save($change_model_data); 
		foreach ($fields as $field_key) { 
			$this->ChangeField->create(); 
			$this->ChangeField->save(array(
				'ChangeField' => array(
					'change_id'       => 0, 
					'change_model_id' => $this->ChangeModel->getLastInsertId(), 
					'field_key'       => $field_key, 
					'field_old_val'   => $this->oldData[$model_name][$field_key],
					'field_new_val'   => $this->newData[$model_name][$field_key],
					'schedule_id'     => $this->schedule_id
				)
			)); 
		}
        $this->clearHanging();
    }     
     
    /**
     * Clear Hanging
     *
     * Any time something happens that makes redoing impossible 
     * (i.e. when some changes have been undone and a new 
     * change is made) this function is called.
     */
    function clearHanging() { 
        $this->deleteAll(
        	array(
        		'Change.id <' => 0,
        		'Change.schedule_id' => $this->schedule_id
        	),false,false
        ); 
        $this->ChangeModel->deleteAll(
        	array(
        		'ChangeModel.change_id <' => 0,
        		'ChangeModel.schedule_id' => $this->schedule_id
        	),false,false
        );
        $this->ChangeField->deleteAll(array(
        	'ChangeField.change_id <' => 0,
        	'ChangeField.schedule_id' => $this->schedule_id
        	),false,false
        ); 
    }     

    /**
     * Nudge
     *
     * increments or decrements all of the ids in the Change model
     * and the foreign keys in the ChangeModel and ChangeField models
     *
     * $i should be 1 or -1 
     */
    function nudge($i) { 
        $this->updateAll(
        	array('Change.id' => "Change.id + {$i}"),
        	array('Change.schedule_id' => $this->schedule_id)
        );      
        $this->ChangeModel->updateAll(
        	array('ChangeModel.change_id' => "ChangeModel.change_id + {$i}"),
        	array('ChangeModel.schedule_id' => $this->schedule_id)
        );      
        $this->ChangeField->updateAll(
        	array('ChangeField.change_id' => "ChangeField.change_id + {$i}"),
        	array('ChangeField.schedule_id' => $this->schedule_id)
        );      
    } 
     
	function getChangesForMenu() {
		$menuData = array();
		$directions = array('undo','redo');
		foreach($directions as $direction) {
			$changeData = $this->find('all',array(
				'recursive' => -1,
				'conditions' => ($direction == 'undo') ? 
					array('Change.id BETWEEN ? AND ?' => array(0,10)) :
					array('Change.id BETWEEN ? AND ?' => array(-10,-1)) 
				,
				'order' => ($direction == 'undo') ?
					'id' :
					'id desc'
			));
			foreach($changeData as $change) {
				$menuData[$direction][$change['Change']['description']] = array(
					'url' => array('controller' => 'changes', 'action' => 'jumpTo', $change['Change']['id'])
				);
			}
			if (!isset($menuData[$direction])) {
				$menuData[$direction] = array("Nothing to {$direction}");
			} else {
				$menuData[$direction][] = "<hr/>";
				$menuData[$direction]['More...'] = array(
					'url' => array('controller' => 'changes', 'action' => 'history'),
					'ajax' => array(
						'update' => 'dialog_content',
						'complete' => "openDialog('history','#FFF','true')",
						'id' => 'history'
					)
				);
			}
		}
		return $menuData;
	}
} 
?>
