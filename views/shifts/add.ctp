<div class="shifts form">
<?php echo $form->create('Shift',array('onsubmit'=>'saveScroll()'));?>
	<fieldset>
 		<legend><?php __('New Shift');?></legend>
	<?php
		echo $form->input('area_id', array(
			'default' => $area_id,
			'between' => '&nbsp;'
		));
		echo $form->input('day_id', array(
			'default' => $day_id,
			'between' => '&nbsp;'
		));
		echo $form->input('start', array(
			'interval' => 15,
			'selected' => $start,
			'between' => '&nbsp;'
		));
		echo $form->input('end', array(
			'interval' => 15,
			'selected' => $end,
			'between' => '&nbsp;'
		));
		echo $form->input('num_people', array(
			'label' => '# of People',
			'default' => 1,
			'between' => '&nbsp;'
		));
	?>
	</fieldset>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
</div>
