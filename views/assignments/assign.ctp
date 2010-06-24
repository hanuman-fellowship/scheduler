<div class="assignments form">
	<fieldset>
 		<legend><?php __('Assign Person');?></legend>
<?
$lists = array('available','all');
foreach($lists as $list) {
$rcId = 0;
?><div id='<?=$list?>' <? if($list == 'all') { ?>style='display:none'<?}?>><?
echo "<div style='float:left;padding:10px;'>";
	foreach($people as $person) {
		if ($person['available'] || $list == 'all') {
			if ($rcId != $person['resident_category_id']) {
				echo "</div><div style='float:left;padding:10px'><strong>{$person['ResidentCategory']['name']}</strong><br/>";	
				$rcId = $person['resident_category_id'];
			}
			echo $ajax->link($person['name'],array($shift,$person['id']),array(
				'class' => 'RC_' . $person['resident_category_id'],
				'update'=>'schedule_content',
				'complete'=>'hideDialog()'
			)) . '<br>';
		}
	}
	echo '</div>';
?></div><?
}
?>
	<div style="clear:both;float:right;">
		<input type="checkbox" id="conflictsBox" value="0" onclick="toggleConflicts()" />
		<label for='conflictsBox'>Ignore Conflicts</label>
	</div>
	</fieldset>
</div>

