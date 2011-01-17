<fieldset>
	<legend><?php __('Conflicts');?></legend>
<span style='font-size:12px'>Check the boxes next to <span style='color:green'>changes</span> you'd like to import.<br>
<span style='color:red'>Conflicts</span> are listed with your changes <i>underneath</i> the change to be imported.<br>
</span><hr>
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
<?=$form->hidden('conflicts')?>
<?=$form->submit('Merge')?>
<?=$form->end()?>
</div>
<?=$this->element('message');?>
