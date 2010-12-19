<?= $ajax->form($this->action,'post',array(
	'model'=>'ResidentCategory',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('Edit Category');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('name',array('id' => 'name'));
		echo $form->input('color',array('id' => 'color'));
	?>
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>
