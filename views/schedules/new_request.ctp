<fieldset>
	<legend><?php __("New {$areaName} Request");?></legend>
<?= $ajax->form($this->action,'post',array(
	'model'=>'Schedule',
	'update'=>'dialog_content',
	'before'=>"wait()"
)); ?>
	<?= $form->input('name') ?>
	<hr>
		<div class='tall left'>
	<?=$form->radio('based_on',
		array(
			'published' => 'Published Schedule',
			'template' => 'Template'
		),
		array(
			'separator' => '<br>',
			'value' => 'published'
		))?>
		</div>
<?php echo $form->end('Submit');?>
</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>
