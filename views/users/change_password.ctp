<?= $ajax->form($this->action,'post',array('model'=>'User','update'=>'dialog_content','before'=>'wait()'));?>
	<fieldset>
 		<legend><?php __('Change Password');?></legend>
	<?php
		echo "Old Password: " .$form->password('old_password',array(
			'between' => '&nbsp;',
			'id' => 'old_password'
		)) . "<br>";
		echo "New Password: " . $form->password('new_password',array(
			'between' => '&nbsp;',
			'id' => 'new_password'
		)) . "<br>";
		echo "Retype Password: " . $form->password('retype',array(
			'between' => '&nbsp;',
			'id' => 'retype'
		));
	?>
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'old_password'));?>