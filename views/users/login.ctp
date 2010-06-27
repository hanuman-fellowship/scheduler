<?php echo 'Login<br/><br/>'; ?>
<?php
echo $ajax->form($this->action,'post',array('model'=>'User','update'=>'dialog_content'));
echo $form->input('username', array('label' => 'Username','id'=>'username'));
echo $form->input('password', array('label' => "Password"));
echo $form->submit('Login');
echo $form->end();
if (Authsome::get('id')) {
	echo $javascript->codeBlock('window.location.reload()');
} else {
	echo $javascript->codeBlock("get('username').select()");
}
?>