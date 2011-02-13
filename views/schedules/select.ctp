<fieldset>
	<legend><?php __('Select Schedule');?></legend>
<?
foreach(array('1'=>'none','0'=>'') as $autoSelect => $disp) {
	echo "<div id='autoSelect_{$autoSelect}' class='tall'  style='display:{$disp}'>";
	echo "<div style='clear:both'>";
	$latest_selected = $session->read('Schedule.latest') ? 
		'selected' :
		'';
	echo $html->link('Latest Published',
		array('latest',$autoSelect),
		array(
			'onClick'=>'wait()',
			'class'=> $latest_selected
		)
	);
	echo "</div>";
?>
	<div class='left' style='float:left;padding:10px'>
	<b>My Schedules</b><br/>
<?
	foreach($schedules['mine'] as $schedule) {
		$mine_selected = ($schedule['Schedule']['id'] == $schedule_id) ? 
			'selected' :
			'';
		echo $html->link($schedule['Schedule']['name'],
			array($schedule['Schedule']['id'],$autoSelect),
			array(
				'onClick'=>'wait()',
				'class'=> $mine_selected
			)
		);
		echo '<br/>';
	}
	?>
	</div>
	<div class='left' style='float:left;padding:10px'>
	<b>Other Schedules</b><br/>
	<?
	foreach($schedules['all'] as $schedule) {
		if( $schedule['Schedule']['user_id'] == Authsome::get('id') ||
		$schedule['Schedule']['user_id'] == 0) {
			continue;
		}
		$other_selected = ($schedule['Schedule']['id'] == $schedule_id) ? 
			'selected' :
			'';
		echo $html->link(
			"{$schedule['Schedule']['name']} ({$schedule['User']['username']})",
			array($schedule['Schedule']['id'],$autoSelect),
			array(
				'onClick'=>'wait()',
				'class'=> $other_selected
			)
		);
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
<?=$this->element('message');?>
