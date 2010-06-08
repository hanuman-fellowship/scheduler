<div class="shifts form">
<?php echo $form->create('Shift');?>
	<fieldset>
 		<legend><?php __('Edit Shift');?></legend>
	<?php
	
		echo $html->link('Delete Shift',array('action'=>'delete',$this->data['Shift']['id']));

		echo $form->hidden('id');
		echo $form->input('area_id');
		echo $form->input('day_id');
		echo $form->input('start', array('interval' => 15));
		echo $form->input('end', array('interval' => 15));
		echo $form->input('num_people', array('label' => '# of People'));
		echo $form->hidden('schedule_id');
	?>
	</fieldset>
<?php echo $form->end('Submit');?> 
</div>
