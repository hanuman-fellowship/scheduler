<?= $ajax->form($this->action,'post',array(
	'model'=>'RequestFloatingShift',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('Edit Floating Shift');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->hidden('request_area_id');
		echo $form->input('person_id');
		echo $form->input('hours', array(
			'id' => 'hours',
			'default' => 1,
		));
		echo $form->input('note');
	?>
	<?=$form->end('Submit');?>
	</fieldset>
<?=$html->link('Delete Floating Shift',array('action'=>'delete',$this->data['RequestFloatingShift']['id']),
	array(
		'style'=>'position:relative;top:5px',
		'onclick'=>'wait();saveScroll()'
	)
);?>
<?=$this->element('message',array('default_field'=>'hours'));?>
