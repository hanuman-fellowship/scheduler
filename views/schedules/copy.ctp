<? if (!isset($url)) { ?>
<? $user = Authsome::get('id'); ?>
<? $schedule_name = $template ? 
	"<b>Template</b> [{$template}]" : 
	"<b>{$groupName}</b> [{$this->element('schedule_message',array('simple'=>true))}]";
?>
<fieldset>
	<legend><?php __("Edit a Copy of {$schedule_name}");?></legend>
<?= $ajax->form($this->action,'post',array(
	'model'=>'Schedule',
	'update'=>'dialog_content',
	'before'=>"wait()"
)); ?>
	<?php
		echo $form->hidden('id',array('value'=>$id));
		echo $form->input('name',array(
			'id' => 'name',
			'between' => '&nbsp;',
			'label' => 'Temporary Name'
		));
	?>
	<i>(this name will not be published)</i>
	<?= $template ?
	"<hr>
	Areas, shifts, etc. will be taken from the template<br>
	People will be taken from the schedule you are currently viewing
	<hr>" : ''
	?>
<?php echo $form->end('Submit');?>
</fieldset>
<? $no_wait = false ?>
<? } else { ?>
Have fun...
<? $no_wait = true ?>
<? } ?>
<?=$this->element('message',array('default_field'=>'name','no_wait'=>$no_wait));?>
