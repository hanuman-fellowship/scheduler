<?php echo $form->create('User');?>
	<fieldset>
 		<legend><?php __('Add User');?></legend>
	<?php
		echo $form->input('username');
		echo $form->input('password');
		echo $form->select('role',
			array(
				'operations' => 'Operations'
			),
			null,
			array('empty' => false)
		);
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
