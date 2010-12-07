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
 		<legend><?php __("New Note for Operations");?></legend>
	<?php
		echo $form->hidden('person_id');
		echo $form->input('note',array(
			'id' => 'edit_notes',
			'label' => false
		));
	?>
<?php echo $form->submit('Submit',array('id'=>'submit_button'));?>
<?=$form->end();?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'edit_notes'));?>
