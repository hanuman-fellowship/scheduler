<fieldset>

<? if (isset($parent_id)) { ?>
	<legend><?php __('Merge');?></legend>
	Choose a schedule to import changes from:<hr>
	<div class='tall left'>
<?
foreach($schedules as $schedule) {
	if (!in_array($schedule['Schedule']['id'],array($schedule_id, $parent_id))) {
		echo $ajax->link($schedule['Schedule']['name'],
			array($schedule['Schedule']['id']),
			array(
				'before'=>'wait()',
				'update'=>'dialog_content',
			)
		);
		echo '<br/>';
	}
}	
?>
</div>

<? } else { ?>

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
<? $myChanges = array() ?>
<? foreach($changes as $change_id => $change) { ?>
	<? $conflicts = is_array($change) ?>
	<span style='color:<?=$conflicts ? 'red' : 'green'?>'>
		<?=$form->checkbox($change_id,array('checked'=> $conflicts ? '' : 'checked'))?>
		<?=$form->label($change_id,$conflicts ? $change['b'] : $change)?><br>
	</span>
	<? if ($conflicts) { ?>
	<div style='padding-left:2em'>
		<? foreach($change['conflicts'] as $myChange => $description) { ?>
		<i>
			<span class="desc_<?=$myChange?>">
			<?=$description['a']?>
			</span>
		</i>
			<? $dup = array_key_exists($myChange,$myChanges)? "dup{$myChanges[$myChange]}_" : ''?>
			<? $dupId = "Schedule"?>
			<? if ($dup) $dupId .= 'Dup'.$myChanges[$myChange]?>
			<? $dupId .= "Remove".$myChange?>
			<?=$form->checkbox("{$dup}remove_{$myChange}",array(
				'checked'=> $conflicts ? '' : 'checked',
				'onClick' => "
					$$('.box_{$myChange}').each(function(e){
						e.checked = $('{$dupId}').checked;
					});
					$$('.desc_{$myChange}').each(function(e){
						e.style.textDecoration = $('{$dupId}').checked ? 'line-through' : ''
					});
				",
				'class' => "box_{$myChange}",
				))?>
			<?=$form->label("{$dup}remove_{$myChange}","Remove")?><br>
		<br>
			<? if ($dup) {
				$myChanges[$myChange]++;
			} else {
				$myChanges[$myChange] = 1;
			} ?>
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
<? } ?>

</fieldset>
<?=$this->element('message');?>
