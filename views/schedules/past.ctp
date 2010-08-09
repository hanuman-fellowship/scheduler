<fieldset>
	<legend><?php __('Past Schedules');?></legend>
<div class='tall left'>
<?
$current_schedule = $session->read('Schedule.id');
foreach($schedules as $schedule) {
	echo ($schedule['Schedule']['id'] == $current_schedule) ? '<i>' : '';
	echo $this->html->link(
		$this->Time->niceShort($schedule['Schedule']['updated'])
		,array('action'=>'select',$schedule['Schedule']['id'])
	)."<br>";
	echo ($schedule['Schedule']['id'] == $current_schedule) ? '</i>' : '';
}
?>
</div>
</fieldset>
