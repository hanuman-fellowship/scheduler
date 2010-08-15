<fieldset>
	<legend><?php __('Past Schedules');?></legend>
<div class='tall left' style='width:15em'>
<?
$current_schedule = $session->read('Schedule.id');
foreach($schedules as $schedule) {
	$current = $schedule['Schedule']['id'] == $current_schedule ? true : false;
	echo $current ? '<i>' : '';
	echo $this->html->link(
		$this->Time->niceShort($schedule['Schedule']['updated']),
		array('action'=>'select',$schedule['Schedule']['id']),
		array(
			'onClick' => 'wait()',
			'id' => $current ? 'current' : ''
		)
	)."<br>";
	echo $current ? '</i>' : '';
}
?>
<?=$this->javascript->codeBlock("get('current').scrollIntoView(true)");?>
</div>
</fieldset>
<?=$this->element('message');?>
