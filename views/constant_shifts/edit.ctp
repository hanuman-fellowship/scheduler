<?= $ajax->form($this->action,'post',array('model'=>'ConstantShift','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Edit Constant Shift');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('name', array(
			'id' => 'name',
			'between' => '&nbsp;'
		));
		echo $form->input('resident_category_id', array(
			'between' => '&nbsp;'
		));
		echo $form->input('day_id', array(
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
		echo $form->input('specify_hours', array(
			'between' => '&nbsp;',
			'size' => 1,
			'onClick' => "$('hours').toggle().focus()",
			'div' => array(
				'style' => 'float:left'
			),
			'after' => '&nbsp;'
		));
		echo $form->input('hours', array(
			'between' => '&nbsp;',
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