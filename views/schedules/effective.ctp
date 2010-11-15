<?= $ajax->form($this->action,'post',array('model'=>'Schedule','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Change Date Range');?></legend>
	<?php
		echo $form->input('start', array(
			'id' => 'start',
			'between' => '&nbsp;'
		));
		echo $form->input('end', array(
			'id' => 'end',
			'between' => '&nbsp;'
		));
		echo $form->hidden('effective');
	?>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'start'));?>
