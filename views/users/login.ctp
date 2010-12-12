<fieldset>
	<legend><?php __('Login');?></legend>
<?php
echo $ajax->form($this->action,'post',array(
	'model'=>'User',
	'update'=>'dialog_content',
	'before'=>'wait()',
	'inputDefaults' => array('between' => '&nbsp;')
));
echo $form->input('username', array('id'=>'username'));
echo $form->input('password');
echo $ajax->link('Forgot Password',array('controller'=>'users','action'=>'resetPassword'),array(
	'update' => 'dialog_content',
	'style' => 'font-size:10px'
));
echo $form->submit('Login');
echo $form->end();
?>
</fieldset>
<?=$this->element('message',array('default_field'=>'username'));?>
