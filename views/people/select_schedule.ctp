<fieldset>
	<legend><?php __('View Person Schedule');?></legend>
<?
foreach(array('overlay_0'=>'none','overlay_1'=>'') as $overlay => $disp) {
	echo "<div id='{$overlay}' style='display:{$disp}'>";
	$rcId = 0;
	echo "<div style='float:left;padding:10px;'>";
	foreach($people as $person) {
        if($overlay == 'overlay_0') {
			$type = 'ajax';
			$attributes = array(
				'update' => 'dialog_content',
				'complete' => "openDialog('1_1','#FFF','true')"
			);
		} else {
			$type = 'html';
			$attributes = null;
		}
		$attributes['class'] = 'RC_' . $person['PeopleSchedules']['resident_category_id'];
		if ($rcId != $person['PeopleSchedules']['resident_category_id']) {
			echo "</div><div style='float:left;padding:10px'><strong>{$person['PeopleSchedules']['ResidentCategory']['name']}</strong><br/>";	
			$rcId = $person['PeopleSchedules']['resident_category_id'];
		}
		echo ${$type}->link($person['Person']['first'],array('action'=>'schedule',$person['Person']['id']),$attributes) . '<br>';
	}
	echo '</div></div>';
}
?>
	<div style="clear:both;float:right;">
		<input id="overlay" type="checkbox" onclick="swap('overlay_1','overlay_0')" />
		<label for='overlay'>Overlay</label>
	</div>
</fieldset>

