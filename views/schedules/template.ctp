<? if (!isset($url)) { ?>
<? $user = Authsome::get('id'); ?>
<fieldset>
	<legend><?php __("Create a Template from <b>{$groupName}</b> [{$this->element('schedule_message',array('simple'=>true))}]");?></legend>
<?= $ajax->form($this->action,'post',array(
	'model'=>'Schedule',
	'update'=>'dialog_content',
	'before'=>"wait()"
)); ?>
	<?php
		echo $form->input('name',array(
			'id' => 'name',
			'between' => '&nbsp;',
		));
	?>
<?php echo $form->end('Submit');?>
</fieldset>
<? $no_wait = false ?>
<? } else { ?>
Template Saved
<? $no_wait = true ?>
<? } ?>
<?=$this->element('message',array('default_field'=>'name','no_wait'=>$no_wait));?>
