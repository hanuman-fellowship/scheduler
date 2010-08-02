<fieldset>
	<legend><?php __('New Schedule');?></legend>
<?php echo $form->create(false, array('action' => 'doNewBranch'));?>
	<?php
		echo $form->input('name');
	?>
<?php echo $form->end('Submit');?>
</fieldset>