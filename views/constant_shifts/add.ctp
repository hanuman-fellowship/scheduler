<?= $ajax->form($this->action,'post',array(
	'model'=>'ConstantShift',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('New Constant Shift');?></legend>
	<?php
		echo $form->input('name', array('id' => 'name'));
		echo $form->input('resident_category_id');
		echo $form->input('day_id');
		echo $form->input('start', array(
			'interval' => 15,
			'selected' => $start,
		));
		echo $form->input('end', array(
			'interval' => 15,
			'selected' => $end,
		));
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
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>
