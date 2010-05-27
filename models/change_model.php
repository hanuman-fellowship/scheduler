<?php  
/**
 * Track Changes - ChangeModel Model class file
 *
 * @author Jason Galuten <jason@galuten.com>
 * @copyright Copyright (c) 2010, Jason Galuten
 * @version 0.1
 */
class ChangeModel extends AppModel { 

    var $name = 'ChangeModel'; 
    var $belongsTo = array('Change'); 
    var $hasMany = array('ChangeField'); 

} 
?>