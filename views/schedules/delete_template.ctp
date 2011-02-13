<fieldset>
	<legend><?php __('Delete Template');?></legend>
<?
foreach($schedules as $schedule) {
	$selected = ($schedule['Schedule']['id'] == $schedule_id) ? 
		'selected' : '';
	echo $html->link($schedule['Schedule']['name'],
		array($schedule['Schedule']['id']),
		array(
			'class'=>$selected
		),
		"Delete the template \"{$schedule['Schedule']['name']}\"?"
	);
	echo '<br/>';
}
?>
</fieldset>
<?=$this->element('message');?>
