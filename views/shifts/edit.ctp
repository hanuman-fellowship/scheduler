
<div class="shifts form">
<?php echo $form->create('Shift', array('onsubmit'=>'saveScroll()'));?>
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
	<?php echo '<span style="float:right">'.$form->end('Submit').'</span>';?>
	</fieldset>
<?=$html->link('Delete Shift',array('action'=>'delete',$this->data['Shift']['id']),
	array(
		'style'=>'position:relative;top:5px',
		'onclick'=>'saveScroll()'
	)
);?>
</div>
