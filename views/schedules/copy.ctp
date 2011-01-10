<? if (!isset($url)) { ?>
<? $user = Authsome::get('id'); ?>
<fieldset>
	<legend><?php __("Edit a Copy of <b>{$groupName}</b> [{$this->element('schedule_message',array('simple'=>true))}]");?></legend>
<?= $ajax->form($this->action,'post',array(
	'model'=>'Schedule',
	'update'=>'dialog_content',
	'before'=>"wait()"
)); ?>
	<?php
		echo $form->input('name',array(
			'id' => 'name',
			'between' => '&nbsp;',
			'label' => 'Temporary Name'
		));
	?>
	<i>(this name will not be published)</i>
<?php echo $form->end('Submit');?>
</fieldset>
<? $no_wait = false ?>
<? } else { ?>
Have fun...
<? $no_wait = true ?>
<? } ?>
<?=$this->element('message',array('default_field'=>'name','no_wait'=>$no_wait));?>
