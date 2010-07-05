<div class="profiles form">
	<fieldset>
 		<legend><?php __('Upload Profile Image');?></legend>
	<?php
		echo $form->create('Profile', array('type' => 'file'));
		echo $form->hidden('id',array('default'=>$id));
		echo $form->file('profile', array(
			'between' => '&nbsp;'
		));
	?>
	</fieldset>
<?=$form->end('Submit');?>
</div>
