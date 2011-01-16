<fieldset>
	<legend><?php __('Conflicts');?></legend>
<div class='tall left'>
<?= $ajax->form($this->action,'post',array(
	'model' => 'Schedule',
	'before'=>'wait()',
	'update' =>'dialog_content',
	'inputDefaults' => array('between' => '&nbsp;')
))?>
<?=$form->hidden('schedule_id',array('value'=>$schedule_id))?>
<? foreach($conflicts as $conflict) { ?>
	<? foreach($conflict['conflicts'] as $change_id => $description) { ?>
		<?=$form->checkbox($change_id)?>
		<?=$form->label($change_id,$description['b'])?><br>
	<? } ?>
<? } ?>
<?=$form->submit('Merge')?>
<?=$form->end()?>
</div>
<?=$this->element('message');?>
