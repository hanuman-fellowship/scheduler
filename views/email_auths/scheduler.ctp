<fieldset>
	<legend><?php __('Scheduler Email Settings');?></legend>
Enter your gmail credentials
<?php
echo $ajax->form($this->action,'post',array(
	'model'=>'EmailAuth',
	'update'=>'dialog_content',
	'before'=>'wait()',
	'inputDefaults' => array('between' => '&nbsp;')
));
echo $form->hidden('id',array('value'=>'1'));
echo $form->input('name', array('id'=>'name','size'=>'30'));
echo $form->input('email', array('id'=>'email','size'=>'30'));
echo $form->input('password', array('id'=>'password','size'=>'30'));
echo $form->submit('Submit');
echo $form->end();
?>
</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>
