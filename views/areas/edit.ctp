<?= $ajax->form($this->action,'post',array(
	'model'=>'Area',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('Edit Area');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('name',array('id' => 'name'));
		echo $form->input('short_name',array('id' => 'short_name'));
		echo $form->input('manager',array('id' => 'manager'));
	?>
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>
