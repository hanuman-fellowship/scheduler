<fieldset>
	<legend><?php __('Conflicts');?></legend>
<span style='font-size:12px'>Your changes are in <span style='color:blue'>blue</span>, and the conflicting changes are in <span style='color:red'>red</span>.<br>
Check the changes you'd like to import (despite the conflict)</span><hr>
<div class='tall left'>
<?= $ajax->form($this->action,'post',array(
	'model' => 'Schedule',
	'before'=>'wait()',
	'update' =>'dialog_content',
	'inputDefaults' => array('between' => '&nbsp;')
))?>
<?=$form->hidden('schedule_id',array('value'=>$schedule_id))?>
<? foreach($conflicts as $conflict) { ?>
	<span style='color:blue'><?=$conflict['a']?></span>
	<div style='padding-left:2em'>
	<? foreach($conflict['conflicts'] as $change_id => $description) { ?>
		<span style='color:red'>
		<?=$form->checkbox($change_id)?>
		<?=$form->label($change_id,$description['b'])?><br>
		</span>
	<? } ?>
	</div>
<? } ?>
<?=$form->submit('Merge')?>
<?=$form->end()?>
</div>
<?=$this->element('message');?>
