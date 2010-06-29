<div class="people form">
<?php echo $form->create('Person');?>
	<fieldset>
 		<legend><?php __('Add Person');?></legend>
	<?php
		echo $form->input('name',array(
			'between' => '&nbsp;'
		));
		echo $form->input('resident_category_id',array(
			'between' => '&nbsp;'
		));
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
