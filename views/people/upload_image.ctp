<div class="profiles form">
	<fieldset>
 		<legend><?php __('Upload Profile Image');?></legend>
	<?php
		echo $form->create('Person', array('type' => 'file'));
		echo $form->hidden('id',array('default'=>$id));
		echo $form->file('person', array(
			'between' => '&nbsp;'
		));
	?>
	</fieldset>
<?=$form->end('Submit');?>
</div>
