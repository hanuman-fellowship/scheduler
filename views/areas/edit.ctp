<div class="areas form">
<?php echo $ajax->form('edit','post',array('model'=>'Area','update'=>'schedule_content','complete'=>'hideDialog()'));?>
	<fieldset>
 		<legend><?php __('Edit Area');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('name');
		echo $form->input('short_name');
		echo $form->input('manager');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
