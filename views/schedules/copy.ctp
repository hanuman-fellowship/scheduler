<? $user = Authsome::get('id'); ?>
<fieldset>
	<legend><?php __("Edit a Copy of <i>{$groupName}</i>");?></legend>
<?= $ajax->form($this->action,'post',array(
	'model'=>'Schedule',
	'update'=>'dialog_content',
	'before'=>"wait()"
)); ?>
	<?php
		echo $form->input('name',array(
			'id' => 'name',
			'between' => '&nbsp;'
		));
	?>
<?php echo $form->end('Submit');?>
</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>