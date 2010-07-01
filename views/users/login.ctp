<fieldset>
	<legend><?php __('Login');?></legend>
<?php
echo $ajax->form($this->action,'post',array('model'=>'User','update'=>'dialog_content'));
echo $form->input('username', array(
	'label' => 'Username',
	'id'=>'username',
	'between'=>'&nbsp;'
));
echo $form->input('password', array(
	'label' => "Password",
	'between' => '&nbsp;'
));
echo $form->submit('Login');
echo $form->end();
?>
</fieldset>
<?
if (Authsome::get('id')) {
	echo $javascript->codeBlock('window.location.reload()');
} else {
	echo $javascript->codeBlock("get('username').select()");
}
?>
