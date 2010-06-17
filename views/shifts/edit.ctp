<div class="shifts form">
<?php echo $form->create('Shift');?>
	<fieldset>
 		<legend><?php __('Edit Shift');?></legend>
	<?php

		echo $form->hidden('id');
		echo $form->input('area_id');
		echo $form->input('day_id');
		echo $form->input('start', array('interval' => 15));
		echo $form->input('end', array('interval' => 15));
		echo $form->input('num_people', array('label' => '# of People'));
	?>
	</fieldset>
<?=$form->submit('Submit');?> 
<?=$html->link('Delete Shift',array('action'=>'delete',$this->data['Shift']['id']),
	array('style'=>'float:right')
);?>
</div>
