<div class="areas form">
<?php echo $form->create('Area');?>
	<fieldset>
 		<legend><?php __('Add Area');?></legend>
	<?php
		echo $form->input('name');
		echo $form->input('short_name');
		echo $form->input('manager');
	?>
	</fieldset>
<?php echo '<span style="float:right">'.$form->end('Submit').'</span>';?>
</div>
