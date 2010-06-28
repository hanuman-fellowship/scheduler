<div class="areas form">
<?php echo $form->create('Area');?>
	<fieldset>
 		<legend><?php __('New Area');?></legend>
	<?php
		echo $form->input('name');
		echo $form->input('short_name');
		echo $form->input('manager');
	?>
	</fieldset>
<?=$form->end('Submit');?>
</div>
