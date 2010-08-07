<?= $ajax->form($this->action,'post',array('model'=>'User','update'=>'dialog_content'));?>
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
		echo $form->select('role',
			array(
				'operations' => 'Operations'
			),
			null,
			array('empty' => false)
		);
	?>
<?=$this->element('validate',array('default_field'=>'username'));?>
	</fieldset>
<?php echo $form->end('Submit');?>
