<fieldset>
	<legend><?php __('Delete Schedule');?></legend>
<?
foreach($schedules as $schedule) {
	$style = ($schedule['Schedule']['id'] == $schedule_id) ? 
		array('<b>','</b') :
		array(null,null);
	echo $style[0];
	echo $html->link($schedule['Schedule']['name'],
		array($schedule['Schedule']['id']),
		array('onClick' => 'wait()')
	);
	echo $style[1];
	echo '<br/>';
}
?>
</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>
