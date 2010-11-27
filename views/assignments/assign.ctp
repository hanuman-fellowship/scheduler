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
?><div class='tall' id='<?=$list?>' <? if($list == 'all') { ?>style='display:none'<?}?>><?
	foreach($people as $person) {
		if ($person['available'] === -1) {continue;} // already on this shift so don't ever show.
		if ($person['available'] || $list == 'all') {
			if ($rcId != $person['ResidentCategory']['id']) {
				if ($rcId != 0) { echo "</div>";};
				echo "<div class='left' style='float:left;padding:10px'><strong>{$person['ResidentCategory']['name']}</strong><br/>";	
				$rcId = $person['ResidentCategory']['id'];
			}
			echo $html->link($person['name'],array($shift,$person['id']),array(
				'class' => 'RC_' . $person['ResidentCategory']['id'],
				'onclick'=>'wait();saveScroll()',
				'style' => 'background-color:#';
			)) . '<br>';
		}
	}
	echo '</div>';
?></div><?
}
?>
	</div>
	<div style="clear:both">
		<?=$form->create('Assignment',array('type'=>'post','onSubmit'=>'wait()'));?>
		Other: <?=$form->text('other',array('id' => 'other'));?>
		<?=$form->hidden('shift',array('value'=>$shift));?>
		<?=$form->end();?>
	</div>
</fieldset>
<?=$this->element('message',array('default_field'=>'other'));?>
