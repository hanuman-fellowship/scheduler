<?= $ajax->form($this->action,'post',array('model'=>'ConstantShift','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
	<fieldset>
 		<legend><?php __('New Constant Shift');?></legend>
	<?php
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
			'selected' => $start,
			'between' => '&nbsp;'
		));
		echo $form->input('end', array(
			'interval' => 15,
			'selected' => $end,
			'between' => '&nbsp;'
		));
		echo $form->input('specify_hours', array(
			'between' => '&nbsp;',
			'size' => 1,
			'onClick' => "toggleDisplay('hours');document.getElementById('hours').focus()",
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
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>