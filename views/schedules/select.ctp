<fieldset>
	<legend><?php __('Select Schedule');?></legend>
<?
foreach(array('1'=>'none','0'=>'') as $autoSelect => $disp) {
	echo "<div id='autoSelect_{$autoSelect}' class='tall'  style='display:{$disp}'>";
	echo "<div style='clear:both'>";
	echo $html->link('Latest Published',array('latest',$autoSelect));
	echo "</div>";
?>
	<div class='left' style='float:left;padding:10px'>
	<b>My Schedules</b><br/>
<?
	foreach($schedules['mine'] as $schedule) {
		$style = ($schedule['Schedule']['id'] == $schedule_id) ? 
			array('<i>','</i>') :
			array(null,null);
		echo $style[0];
		echo $html->link($schedule['Schedule']['name'],array($schedule['Schedule']['id'],$autoSelect));
		echo $style[1];
		echo '<br/>';
	}
	?>
	</div>
	<div class='left' style='float:left;padding:10px'>
	<b>Other Schedules</b><br/>
	<?
	foreach($schedules['all'] as $schedule) {
		if( $schedule['Schedule']['user_id'] == Authsome::get('id')) {
			continue;
		}
		$style = ($schedule['Schedule']['id'] == $schedule_id) ? 
			array('<i>','</i>') :
			array(null,null);
		echo $style[0];
		echo $html->link(
			"{$schedule['Schedule']['name']} ({$schedule['User']['username']})",
			array($schedule['Schedule']['id'],$autoSelect)
		);
		echo $style[1];
		echo '<br/>';
	}
	?>
	</div>
	</div>
	<?
}
?>
<div style='clear:both;position:relative;top:3px'>
<input id="autoSelect" type="checkbox" onclick="swap('autoSelect_1','autoSelect_0')" />
<label for='autoSelect'>Load this schedule when I login</label>
</div>
</fieldset>
