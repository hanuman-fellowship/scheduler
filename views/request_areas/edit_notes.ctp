<?= $ajax->form($this->action,'post',array(
	'model'=>'RequestArea',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()'
));?>
	<fieldset>
 		<legend><?php __('Edit Notes');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('notes',array(
			'id' => 'edit_notes',
			'label' => false
		));
	?>
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'edit_notes'));?>
