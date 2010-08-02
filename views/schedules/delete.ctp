<fieldset>
	<legend><?php __('Delete Schedule');?></legend>
<?
foreach($schedules as $schedule) {
	$style = ($schedule['Schedule']['id'] == $schedule_id) ? 
		array('<b>','</b') :
		array(null,null);
	echo $style[0];
	echo $html->link($schedule['Schedule']['name'],array($schedule['Schedule']['id']),null,
		"Are you sure you want to delete the branch \"{$schedule['Schedule']['name']}\"? This action cannot be undone.");
	echo $style[1];
	echo '<br/>';
}
?>
</fieldset>