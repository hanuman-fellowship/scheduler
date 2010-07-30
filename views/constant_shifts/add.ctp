<?= $ajax->form($this->action,'post',array('model'=>'ConstantShift','update'=>'dialog_content','before'=>'saveScroll()'));?>
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
		echo $form->input('ignore_hours', array(
			'between' => '&nbsp;'
		));
	?>
	</fieldset>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
<?=$this->element('validate',array('default_field'=>'name'));?>
