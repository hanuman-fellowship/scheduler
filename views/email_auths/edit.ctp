<fieldset>
	<legend><?php __('Operations Email Settings');?></legend>
<?php
echo $ajax->form($this->action,'post',array(
	'model'=>'EmailAuth',
	'update'=>'dialog_content',
	'before'=>'wait()',
	'inputDefaults' => array('between' => '&nbsp;')
));
echo $form->hidden('id',array('value'=>'1'));
echo $form->input('username', array('id'=>'username','size'=>'30'));
echo $form->input('password', array('id'=>'password','size'=>'30'));
echo $form->submit('Submit');
echo $form->end();
?>
</fieldset>
<?=$this->element('message',array('default_field'=>'username'));?>
