<?= $ajax->form($this->action,'post',array(
	'model'=>'Area',
	'onSubmit'=>'wait()',
	'update'=>'dialog_content',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('New Area');?></legend>
	<?php
		echo $form->input('name',array('id' => 'name'));
		echo $form->input('short_name',array('id' => 'short_name'));
		echo $form->input('manager',array('id' => 'manager'));
	?>
<?=$form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>
