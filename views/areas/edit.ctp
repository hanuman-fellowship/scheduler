<div class="areas form">
<?php echo $form->create('Area',array('onsubmit'=>'saveScroll()'));?>
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
