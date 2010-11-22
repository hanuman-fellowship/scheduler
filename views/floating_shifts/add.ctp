<?= $ajax->form($this->action,'post',array(
	'model'=>'FloatingShift',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()'
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('New Floating Shift');?></legend>
	<?php
		echo $form->input('area_id', array('default' => $area_id));
		echo $form->input('person_id', array('default' => $person_id));
		echo $form->input('hours', array(
			'id' => 'hours',
			'default' => 1,
		));
		echo $form->input('note');
	?>
	</fieldset>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
<?=$this->element('message',array('default_field'=>'hours'));?>
