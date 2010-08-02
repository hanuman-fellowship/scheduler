<fieldset>
	<legend><?php __('Select Schedule');?></legend>
<?
foreach($schedules as $schedule) {
	$style = ($schedule['Schedule']['id'] == $schedule_id) ? 
		array('<b>','</b') :
		array(null,null);
	echo $style[0];
	echo $html->link($schedule['Schedule']['name'],array($schedule['Schedule']['id']));
	echo $style[1];
	echo '<br/>';
}
?>
</fieldset>