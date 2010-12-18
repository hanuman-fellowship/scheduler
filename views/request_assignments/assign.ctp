<fieldset>
	<legend><?php __('Assign Person');?></legend>
<?
$lists = array('available','all');
foreach($lists as $list) {
$rcId = 0;
?><div class='tall' style='clear:both'><?
?><table id='<?=$list?>' <? if($list == 'all') { ?>style='display:none'<?}?>><?
?><tr><?
	foreach($people as $person) {
		if ($person['available'] === -1) {continue;} // already on this shift so don't ever show.
		if ($person['available'] || $list == 'all') {
			if ($rcId != $person['ResidentCategory']['id']) {
				if ($rcId != 0) { echo "</td>";};
				echo "<td class='left' valigh='top' style='padding:10px'><strong>{$person['ResidentCategory']['name']}</strong><br/>";	
				$rcId = $person['ResidentCategory']['id'];
			}
			echo $html->link($person['name'],array($shift,$person['id']),array(
				'style' => 'color:' . $person['ResidentCategory']['color'],
				'onclick'=>'wait();saveScroll()'
			)) . '<br>';
		}
	}
	echo '</td>';
?></tr><?
}
?>
	</table>
	<div style="clear:both">
		<?=$form->create('RequestAssignment',array('type'=>'post','onSubmit'=>'wait()'));?>
		Other: <?=$form->text('other',array('id' => 'other'));?>
		<?=$form->hidden('shift',array('value'=>$shift));?>
		<?=$form->end();?>
	</div>
</fieldset>
<?=$this->element('message',array('default_field'=>'other'));?>
