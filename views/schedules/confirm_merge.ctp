<fieldset>
	<legend><?php __("Merge the following changes from <b>{$schedule['Schedule']['name']}</b>?");?></legend>
<div class='tall left'>
<? foreach($descriptions as $description) { ?>
	<?=$description?><br>
<? } ?>
</div>
</fieldset>
<?= $ajax->form($this->action,'post',array(
	'model'=>'Schedule',
	'update'=>'dialog_content',
	'before'=>'wait()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
<?=$form->hidden('schedule_id',array('value'=>$schedule_id))?>
<?=$form->end("Let's Try It!")?>
<?=$this->element('message')?>
