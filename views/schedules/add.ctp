<? $user = Authsome::get('id'); ?>
<fieldset>
	<legend><?php __('New Schedule');?></legend>
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
<?=$this->element('validate',array('default_field'=>'name'));?>
</fieldset>
