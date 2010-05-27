<?php  
/**
 * Track Changes - ChangeField Model class file
 *
 * @author Jason Galuten <jason@galuten.com>
 * @copyright Copyright (c) 2010, Jason Galuten
 * @version 0.1
 */
class ChangeField extends AppModel { 

    var $name = 'ChangeField'; 
    var $belongsTo = array('Change','ChangeModel'); 

} 
?>