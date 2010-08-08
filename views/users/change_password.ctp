<?= $ajax->form($this->action,'post',array('model'=>'User','update'=>'dialog_content'));?>
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
<?=$this->element('validate',array('default_field'=>'old_password'));?>
	</fieldset>
<?php echo $form->end('Submit');?>
