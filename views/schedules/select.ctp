<fieldset>
	<legend><?php __('Select Schedule');?></legend>
<?=$html->link('Published',array('latest')); ?>
<div style='float:left;padding:10px'>
<b>My Schedules</b><br/>
<?
foreach($schedules['mine'] as $schedule) {
	$style = ($schedule['Schedule']['id'] == $schedule_id) ? 
		array('<i>','</i>') :
		array(null,null);
	echo $style[0];
	echo $html->link($schedule['Schedule']['name'],array($schedule['Schedule']['id']));
	echo $style[1];
	echo '<br/>';
}
?>
</div>
<div style='float:left;padding:10px'>
<br><b>Other Schedules</b><br/>
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
		array($schedule['Schedule']['id'])
	);
	echo $style[1];
	echo '<br/>';
}
?>
</div>
</fieldset>
