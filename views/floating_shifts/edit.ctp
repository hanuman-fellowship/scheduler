<?= $ajax->form($this->action,'post',array('model'=>'FloatingShift','update'=>'dialog_content','before'=>'saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Edit Floating Shift');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('area_id', array(
			'between' => '&nbsp;'
		));
		echo $form->input('person_id', array(
			'between' => '&nbsp;'
		));
		echo $form->input('hours', array(
			'id' => 'hours',
			'default' => 1,
			'between' => '&nbsp;'
		));
		echo $form->input('note', array(
			'between' => '&nbsp;'
		));
	?>
	<?=$form->end('Submit');?>
	</fieldset>
<?=$html->link('Delete Floating Shift',array('action'=>'delete',$this->data['FloatingShift']['id']),
	array(
		'style'=>'position:relative;top:5px',
		'onclick'=>'saveScroll()'
	)
);?>
<?=$this->element('validate',array('default_field'=>'hours'));?>
