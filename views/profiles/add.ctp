<div class="profiles form">
	<fieldset>
 		<legend><?php __('New Profile');?></legend>
	<?php
		echo $form->create('Profile', array('type' => 'file'));
		echo $form->input('first',array(
			'between' => '&nbsp;'
		));
		echo $form->input('middle',array(
			'between' => '&nbsp;'
		));
		echo $form->input('last',array(
			'between' => '&nbsp;'
		));
		echo $form->input('other',array(
			'between' => '&nbsp;'
		));
		echo $form->file('profile', array(
			'between' => '&nbsp;'
		));
		echo $form->input('person_id', array(
			'type' => 'hidden',
			'between' => '&nbsp;',
			'default' => 1
		));
	?>
	</fieldset>
<?=$form->end('Submit');?>
</div>
