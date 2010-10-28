<?= $ajax->form($this->action,'post',array('model'=>'Shift','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Delete All Shifts');?></legend>
	<?php
		echo $form->input('area_id', array(
			'default' => $area_id,
			'between' => '&nbsp;'
		));
	?>
	</fieldset>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
<?=$this->element('message',array('default_field'=>''));?>
