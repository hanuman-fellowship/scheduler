<?php

class AppController extends Controller {
	var $helpers = array('html','session','form','ajax','javascript','role', 'time');
	
    public $components = array(
    	'RequestHandler',
        'Authsome.Authsome' => array(
            'model' => 'User'
        )
    );
        
	function beforeFilter() {
		// put the latest published schedule into the session
		if (!$this->Session->check('Schedule')) {
			$this->loadModel('Schedule');
			$schedule = $this->Schedule->find('first',
				array(
					'conditions' => array('user_id' => null),
					'order' => 'id desc',
					'recursive' => -1
				)
			);
			$this->Session->write('Schedule', $schedule['Schedule']);
		}
	}	
	
    function loadModel($modelClass = null, $id = null) {
    	$modelObject = parent::loadModel($modelClass, $id);
		$this->$modelClass->schedule_id = $this->Session->read('Schedule.id');
		return $modelObject;
	}	
	
	function setSchedule($id) {
		$this->loadModel('Schedule');
		$schedule = $this->Schedule->findById($id);
		$this->Session->write('Schedule', $schedule['Schedule']);	
	}
	
	function record() {
		$this->loadModel('Change');
        $this->Change->clearHanging(); 
        $this->Change->nudge(1);
	}
	
	function stop($description) {
		// record the main Change model entry
		$this->loadModel('Change');
        $this->Change->save(array( 
            'Change' => array( 
                'id' => 0, 
                'description' => $description,
                'schedule_id' => $this->Session->read('Schedule.id')
            ) 
        )); 	
	}	
	
	function savePage() {
		$this->Session->write('referer',$this->referer());
	}
	
	function loadPage() {
		return $this->Session->read('referer');
	}
	
	
}
?>