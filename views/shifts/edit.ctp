<?= $ajax->form($this->action,'post',array('model'=>'Shift','update'=>'dialog_content','before'=>'saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Edit Shift');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('area_id',array(
			'between' => '&nbsp;'
		));
		echo $form->input('day_id',array(
			'between' => '&nbsp;'
		));
		echo $form->input('start', array(
			'interval' => 15,
			'between' => '&nbsp;'
		));
		echo $form->input('end', array(
			'interval' => 15,
			'between' => '&nbsp;'
		));
		echo $form->input('num_people', array(
			'size' => 1,
			'id' => 'num_people',
			'label' => '# of People',
			'between' => '&nbsp;'
		));
	?>
	<?= $form->end('Submit');?>
	</fieldset>
<?=$html->link('Delete Shift',array('action'=>'delete',$this->data['Shift']['id']),
	array(
		'style'=>'position:relative;top:5px',
		'onclick'=>'saveScroll()'
	)
);?>
<?=$this->element('validate',array('default_field'=>'name'));?>
