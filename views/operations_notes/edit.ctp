<?= $this->element('shortcut',array(
	'shortcut' => 'return',
	'codeBlock' =>'$("submit_button").click()'
));?>
<?= $ajax->form($this->action,'post',array(
	'model'=>'OperationsNote',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()'
));?>
	<fieldset>
	<?php
		echo $form->hidden('id');
		echo $form->hidden('person_id');
		echo $form->hidden('order');
		echo $form->input('note',array(
			'id' => 'edit_note',
			'label' => false
		));
	?>
<?php echo $form->submit('Submit',array('id'=>'submit_button'));?>
<?=$form->end();?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'edit_note'));?>
