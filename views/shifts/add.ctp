<div class="shifts form">
<?php echo $form->create('Shift');?>
	<fieldset>
 		<legend><?php __('New Shift');?></legend>
	<?php
		echo $form->input('area_id', array('default' => $area_id));
		echo $form->input('day_id');
		echo $form->input('start', array('interval' => 15, 'selected' => '13:00:00'));
		echo $form->input('end', array('interval' => 15, 'selected' => '15:00:00'));
		echo $form->input('num_people', array('label' => '# of People', 'default' => 1));
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>