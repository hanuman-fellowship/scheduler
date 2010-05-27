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
        if(!$this->Change->doUndo()) { 
            $this->Session->setFlash("Nothing to undo!"); 
        } 
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
        if(!$this->Change->doRedo()) { 
            $this->Session->setFlash("Nothing to redo!"); 
        } 
        $this->redirect($this->referer()); 
    } 
     
} 
?>