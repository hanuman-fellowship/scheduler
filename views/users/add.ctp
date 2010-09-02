<?= $ajax->form($this->action,'post',array('model'=>'User','update'=>'dialog_content','before'=>'wait()'));?>
	<fieldset>
 		<legend><?php __('Add User');?></legend>
	<?php
		echo $form->input('username',array(
			'between' => '&nbsp;',
			'id' => 'username'
		));
		echo $form->input('password',array(
			'between' => '&nbsp;',
			'id' => 'password'
		));
		echo $form->input('email',array(
			'between' => '&nbsp;',
			'id' => 'email'
		));
		echo "<fieldset class='left'>";
		echo '<legend>Roles</legend>';
		echo $form->checkBox('operations');
		echo $form->label('operations');
		echo '<br/>';
		echo $form->checkBox('manager');
		echo $form->label('manager');
		echo '</fieldset>';
	?>
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'username'));?>
