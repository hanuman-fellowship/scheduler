<div class="assignments form">
	<fieldset>
 		<legend><?php __('Assign Person');?></legend>
<?
$lists = array('available','all');
foreach($lists as $list) {
$rcId = 0;
?><div id='<?=$list?>' <? if($list == 'all') { ?>style='display:none'<?}?>><?
	foreach($people as $person) {
		if ($person['available'] || $list == 'all') {
			if ($rcId != $person['resident_category_id']) {
				echo "<br/><strong>{$person['ResidentCategory']['name']}</strong><br/>";	
				$rcId = $person['resident_category_id'];
			}
			echo $html->link($person['name'],array($shift,$person['id']),array(
				'class' => 'RC_' . $person['resident_category_id']
			)) . '<br>';
		}
	}
	echo '<br/>';
?></div><?
}
?>
		<input type="checkbox" id="conflictsBox" value="0" onclick="toggleConflicts()" />
		<label for='conflictsBox'>Ignore Conflicts</label>
	</fieldset>
</div>

