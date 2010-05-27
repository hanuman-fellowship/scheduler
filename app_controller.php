<?php

class AppController extends Controller {
	var $helpers = array('html','session','form','role', 'time');
	
    public $components = array(
        'Authsome.Authsome' => array(
            'model' => 'User'
        )
    );
        
	function beforeFilter() {
		// put the latest published schedule into the session
		if (!$this->Session->check('Schedule')) {
			$schedule = ClassRegistry::init('Schedule')->find('first',
				array(
					'conditions' => array('user_id' => null),
					'order' => 'id desc'
				)
			);
			$this->Session->write('Schedule', $schedule['Schedule']);
		}
	}	
	
    function LoadModel($modelClass = null, $id = null) {
    	$modelObject = parent::loadModel($modelClass, $id);
		$this->$modelClass->schedule_id = $this->Session->read('Schedule.id');
		return $modelObject;
	}	
	
	function setSchedule($id) {
		$schedule = ClassRegistry::init('Schedule')->findById($id);
		$this->Session->write('Schedule', $schedule['Schedule']);	
	}
	
	function record() {
        $this->Change =& ClassRegistry::init('Change');
        $this->Change->clearHanging(); 
        $this->Change->nudge(1);
	}
	
	function stop($description) {
		// record the main Change model entry
        $this->Change =& ClassRegistry::init('Change');
        $this->Change->save(array( 
            'Change' => array( 
                'id' => 0, 
                'description' => $description
            ) 
        )); 	
	}	
	
}
?>