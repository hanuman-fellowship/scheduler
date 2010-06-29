<div class="areas form">
<?php echo $form->create('Area',array('onsubmit'=>'saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Edit Area');?></legend>
	<?php
		echo $form->hidden('id');
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
<?php echo $form->end('Submit');?>
</div>
