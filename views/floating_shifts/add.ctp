<?= $ajax->form($this->action,'post',array('model'=>'FloatingShift','update'=>'dialog_content','before'=>'saveScroll()'));?>
	<fieldset>
 		<legend><?php __('New Floating Shift');?></legend>
	<?php
		echo $form->input('area_id', array(
			'default' => $area_id,
			'between' => '&nbsp;'
		));
		echo $form->input('person_id', array(
			'default' => $person_id,
			'between' => '&nbsp;'
		));
		echo $form->input('hours', array(
			'interval' => 15,
			'default' => 1,
			'between' => '&nbsp;'
		));
		echo $form->input('note', array(
			'interval' => 15,
			'between' => '&nbsp;'
		));
	?>
	</fieldset>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
<?=$this->element('validate',array('default_field'=>'name'));?>
