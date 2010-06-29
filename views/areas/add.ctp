<div class="areas form">
<?php echo $form->create('Area');?>
	<fieldset>
 		<legend><?php __('New Area');?></legend>
	<?php
		echo $form->input('name',array(
			'between' => '&nbsp;'
		));
		echo $form->input('short_name',array(
			'between' => '&nbsp;'
		));
		echo $form->input('manager',array(
			'between' => '&nbsp;'
		));
	?>
	</fieldset>
<?=$form->end('Submit');?>
</div>
