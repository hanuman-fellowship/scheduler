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
	</fieldset>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
<?=$this->element('validate',array('default_field'=>'hours'));?>
