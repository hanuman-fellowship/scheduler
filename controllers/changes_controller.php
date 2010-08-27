<?php  
/**
 * Track Changes - Changes Controller class file
 *
 * Contains undo and redo methods.
 *
 * @author Jason Galuten <jason@galuten.com>
 * @copyright Copyright (c) 2010, Jason Galuten
 * @version 0.1
 */
 class ChangesController extends AppController { 

    var $name = 'Changes'; 
    
    /**
     * Undo
     *
     * Attempts to undo the latest change, and redirects to the
     * referring page. If there is no change to undo, a message
     * is flashed.
     */
    function undo() { 
		$this->redirectIfNotEditable();
        $this->Change->doUndo(); 
        $this->redirect($this->referer()); 
    } 
     
    /**
     * Redo
     *
     * Attempts to redo the change that was just undone, and redirects to the
     * referring page. If there is no change to redo, a message
     * is flashed.
     */
    function redo() { 
		$this->redirectIfNotEditable();
        $this->Change->doRedo();
        $this->redirect($this->referer()); 
    } 
    
    function history() {
		$this->redirectIfNotEditable();
    	$this->Change->recursive = -1;
    	$this->Change->order = 'id';
    	$this->set('changes',$this->Change->sFind('all'));
    }

	function jump($id) {
		$this->redirectIfNotEditable();
		$this->Change->jumpTo($id);
		$this->redirect($this->referer());
	}
				
	function progress() {
	}
} 
?>
