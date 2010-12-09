<fieldset>
	<legend><?php __('Assign Person');?></legend>
	<div style="float:left;">
		<input type="checkbox" id="conflictsBox" value="0" onclick="toggleConflicts()" />
		<label for='conflictsBox'>Ignore Conflicts</label>
	</div>
<?
$lists = array('available','all');
foreach($lists as $list) {
$rcId = 0;
?><div style='clear:both'><?
?><table id='<?=$list?>' <? if($list == 'all') { ?>style='display:none'<?}?>><?
?><tr><?
	foreach($people as $person) {
		if ($person['available'] === -1) {continue;} // already on this shift so don't ever show.
		if ($person['available'] || $list == 'all') {
			if ($rcId != $person['ResidentCategory']['id']) {
				if ($rcId != 0) { echo "</td>";};
				echo "<td class='left' align='top' style='float:left;padding:10px'> <strong>{$person['ResidentCategory']['name']}</strong><br/>";	
				$rcId = $person['ResidentCategory']['id'];
			}
			echo $html->link($person['name'],array($shift,$person['id']),array(
				'class' => 'RC_' . $person['ResidentCategory']['id'],
				'onclick'=>'wait();saveScroll()',
			)) . '<br>';
		}
	}
	echo '</td>';
?></tr><?
}
?>
	</table>
	<div style="clear:both">
		<?=$form->create('Assignment',array('type'=>'post','onSubmit'=>'wait()'));?>
		Other: <?=$form->text('other',array('id' => 'other','tabindex'=>1));?>
		<?=$form->hidden('shift',array('value'=>$shift));?>
		<?=$form->end();?>
	</div>
</fieldset>
<?=$this->element('message');?>
