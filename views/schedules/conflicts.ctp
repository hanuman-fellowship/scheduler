<fieldset>
	<legend><?php __("Import changes from <b>{$schedule['Schedule']['name']}</b>?");?></legend>
<? if ($changes) { ?>
Check the boxes next to changes you'd like to import.
<?= $conflicts? "<br><span style='color:red'>Conflicts</span> are listed with your changes <i>underneath</i> the change to be imported.<br>
</span>" : ""?><hr>
<div class='tall left'>
<?= $ajax->form($this->action,'post',array(
	'model' => 'Schedule',
	'before'=>'wait()',
	'update' =>'dialog_content',
	'inputDefaults' => array('between' => '&nbsp;')
))?>
<?=$form->hidden('schedule_id',array('value'=>$schedule_id))?>
<? foreach($changes as $change_id => $change) { ?>
	<? $conflicts = is_array($change) ?>
	<span style='color:<?=$conflicts ? 'red' : 'green'?>'>
		<?=$form->checkbox($change_id,array('checked'=> $conflicts ? '' : 'checked'))?>
		<?=$form->label($change_id,$conflicts ? $change['b'] : $change)?><br>
	</span>
	<? if ($conflicts) { ?>
	<div style='padding-left:2em'>
		<? foreach($change['conflicts'] as $description) { ?>
		<span style='font-size:10px'><i>
			<?=$description['a']?>
		</i></span>
		<br>
		<? } ?>
	</div>
	<? } ?>
<? } ?>
</div>
<hr>
<?=$form->hidden('conflicts')?>
<?=$form->submit('Import')?>
<?=$form->end()?>
<? } else { ?>
<br>
<i>Nothing new here!</i>
<br>
<? } ?>
<?=$this->element('message');?>
