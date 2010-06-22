<?=$javascript->link('prototype');?>
<?=$javascript->link('scriptaculous');?> 
<?=$javascript->link('functions');?>
<?=$html->css("dialog") ?>
<div id="dialog" class='out'>
	<div id="dialog_content" class='in ltin tpin' onclick="stopclick(this.event)">
	</div>
</div>
 <? if ($username = Authsome::get('username')) : ?>
 	<?=$username;?> is logged in.
 	<?=$html->link('Logout', array('controller' => 'users', 'action' => 'logout')); ?>
 	<br/>
	<?=$html->link('Undo',array('controller'=>'changes','action'=>'undo'));?>
	
	<?=$html->link('Redo',array('controller'=>'changes','action'=>'redo'));?>
	<br/>
	<?=$html->link('New Area', array('controller' => 'areas', 'action' => 'add'));?>
	| <?=$html->link('View Area', array('controller' => 'areas', 'action' => 'schedule'));?>
	<br/>
	<?=$html->link('New Branch', array('controller' => 'schedules', 'action' => 'doNewBranch'));?>
	| <?=$html->link('Select Branch', array('controller' => 'schedules', 'action' => 'selectBranch'));?>
	| <?=$html->link('Delete Branch', array('controller' => 'schedules', 'action' => 'doDeleteBranch'));?>
	| <?=$html->link('Merge Branch', array('controller' => 'schedules', 'action' => 'doMergeBranch'));?>
 <? else : ?>
 	 <?=$html->link('Login', array('controller' => 'users', 'action' => 'login')); ?>
 <? endif ?>
 <br/>
<!-- <?="Updated: " . $time->format('F jS, Y @ g:ia',$session->read('Schedule.updated')); ?> -->
