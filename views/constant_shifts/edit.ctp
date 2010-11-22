<?= $ajax->form($this->action,'post',array(
	'model'=>'ConstantShift',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('Edit Constant Shift');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('name', array('id' => 'name'));
		echo $form->input('resident_category_id');
		echo $form->input('day_id');
		echo $form->input('start', array('interval' => 15));
		echo $form->input('end', array('interval' => 15));
		echo $form->input('specify_hours', array(
			'size' => 1,
			'onClick' => "$('hours').toggle().focus()",
			'div' => array(
				'style' => 'float:left'
			),
			'after' => '&nbsp;'
		));
		echo $form->input('hours', array(
			'id' => 'hours',
			'size' => 1,
			'label' => false,
			'style' => $this->data['ConstantShift']['specify_hours'] ?
				'float:left;' :
				'float:left;display:none'
		));
	?>
	</fieldset>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
<?=$html->link('Delete Constant Shift',array('action'=>'delete',$this->data['ConstantShift']['id']),
	array(
		'style'=>'position:relative;top:5px',
		'onclick'=>'wait();saveScroll()'
	)
);?>
<?=$this->element('message',array('default_field'=>'name'));?>
