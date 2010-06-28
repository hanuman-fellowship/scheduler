<div class="people form">
<?php echo $form->create('Person');?>
	<fieldset>
 		<legend><?php __('Add Person');?></legend>
	<?php
		echo $form->input('name');
		echo $form->input('resident_category_id');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
