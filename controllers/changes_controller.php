<?php  
class ChangesController extends AppController { 

	var $name = 'Changes'; 
    
	function undo() { 
		$this->redirectIfNotEditable();
		$this->Change->doUndo(); 
		$this->redirect($this->referer()); 
	} 
	 
	function redo() { 
		$this->redirectIfNotEditable();
		$this->Change->doRedo();
		$this->redirect($this->referer()); 
	} 
	
	function history() {
		$this->redirectIfNot('operations');
		$this->Change->recursive = -1;
		$this->Change->order = 'created desc';
		$this->set('changes',$this->Change->sFind('all'));
	}

	function jump($id) {
		$this->redirectIfNotEditable();
		$this->Change->jumpTo($id);
		$this->redirect($this->referer());
	}
				
} 
?>
