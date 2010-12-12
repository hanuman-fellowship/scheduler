<fieldset>
	<legend><?php __('Reset Password');?></legend>
<?php
echo $ajax->form($this->action,'post',array(
	'model'=>'User',
	'update'=>'dialog_content',
	'before'=>'wait()',
	'inputDefaults' => array('between' => '&nbsp;')
));
echo $form->input('email', array('id'=>'email'));
echo $form->submit('Submit');
echo $form->end();
?>
</fieldset>
<?=$this->element('message',array('default_field'=>'email'));?>
