<?= $this->element('shortcut',array(
	'shortcut' => 'return',
	'codeBlock' =>'$("submit_button").click()'
));?>
<?= $ajax->form($this->action,'post',array(
	'model'=>'PersonnelNote',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()'
));?>
	<fieldset>
 		<legend><?php __("Edit Personnel Notes for {$this->data['Person']['name']}");?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->hidden('person_id');
		echo $form->input('notes',array(
			'id' => 'edit_notes',
			'label' => false
		));
	?>
<?php echo $form->submit('Submit',array('id'=>'submit_button'));?>
<?=$form->end();?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'edit_notes'));?>
