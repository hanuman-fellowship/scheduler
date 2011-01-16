<fieldset>
	<legend><?php __('Conflicts');?></legend>
<span style='font-size:12px'>The changes to be imported are in <span style='color:blue'>blue</span>, and your conflicting changes are in <span style='color:red'>red</span>.<br>
Check the changes you'd like to import (despite the conflict)</span><hr>
<div class='tall left'>
<?= $ajax->form($this->action,'post',array(
	'model' => 'Schedule',
	'before'=>'wait()',
	'update' =>'dialog_content',
	'inputDefaults' => array('between' => '&nbsp;')
))?>
<?=$form->hidden('schedule_id',array('value'=>$schedule_id))?>
<? foreach($conflicts as $change_id => $conflict) { ?>
	<span style='color:blue'>
		<?=$form->checkbox($change_id)?>
		<?=$form->label($change_id,$conflict['b'])?><br>
	</span>
	<div style='padding-left:2em'>
	<? foreach($conflict['conflicts'] as $description) { ?>
		<span style='color:red'>
			<?=$description['a']?>
		</span>
		<br>
	<? } ?>
	</div>
<? } ?>
<?=$form->hidden('conflicts')?>
<?=$form->submit('Merge')?>
<?=$form->end()?>
</div>
<?=$this->element('message');?>
