<? $simple = isset($simple) ?>
<? 
$schedule = $session->read('Schedule');
$userRoles = Set::combine(Authsome::get('Role'),'{n}.id','{n}.name');
$now = date('Y-m-d H:i:s');
$current = (
	$schedule['Group']['start'] < $now &&
	$schedule['Group']['end'] > $now
);
?>
<? if (!$simple) { ?>
<div class='schedule_message no_print'>
<span id='group_name'>
<?= ($schedule['request']) ? 'AREA REQUEST FORM' : $schedule['Group']['name']?>
</span>
<? } ?>
<? if ($session->read('Schedule.Group.alternate') && Authsome::get('id') == '') { ?>
	<?= $this->ajax->link(
		'ALTERNATE SCHEDULES',
		array('controller'=>'schedules','action'=>'alternate'),
		array(
			'update' => 'dialog_content',
			'complete' => "openDialog('alternate',true,'bottom')",
			'id' => 'alternate'
		)
	) ?>
<? } ?>
<?= $simple? '' : "<span id='published'>"?>
<?
if ($schedule['request']) {
	if ($schedule['request'] == 2) {
		echo "<span style='color:green'>Editing:</span> {$schedule['name']}";
		echo $html->link(
			'Submit',
			array('controller' => 'schedules', 'action' => 'submitRequest'),
			array(
				'class' => 'button',
				'confirm' => "Submit {$area['Area']['name']} Request Form?",
				'title' => 'Submit Request Form'
			)
		);
	} else {
		echo "<span style='color:blue'>Viewing:</span> {$area['Area']['name']} Request Form";
		if(in_array($area['Area']['id'],
		Set::combine(Authsome::get('Manager'),'{n}.id','{n}.area_id'))) {
			echo " (Submitted)";
		}
	}
} else {
	$message = $current && $schedule['latest_in_group'] ? "" : ($simple? '' : "<span style='color:blue'>Viewing an old schedule: </span>");
	$message = $schedule['username'] != '' ? ($simple? '' : "Viewing: ") : $message;
	$message = $schedule['editable'] ? ($simple? '' : "<span style='color:green'>Editing: </span>") : $message; 
	if (in_array('operations',$userRoles)) {
		$title = ($schedule['username'] != '') ?
			$schedule['editable'] ? $schedule['name'] : 
				$schedule['name']." (".$schedule['username'].")" : 
			"Published on " . $time->format('F jS, Y g:ia',$schedule['updated']);
		echo $message.$title;
	} else {
		$message .= "Published on " . $time->format('F jS, Y g:ia',$schedule['updated']);
		echo $message;
	}
echo $schedule['editable'] ? 
	($simple? '' : $ajax->link(
		'Publish',
		array('controller' => 'schedules', 'action' => 'publish'),
		array(
			'class' => 'button',
			'update' => 'dialog_content',
			'complete' => "openDialog('publish',true,'bottom')",
			'id' => 'publish'
		)
	))
	: '';
}
?>
<? if (!$simple) { ?>
</span>
</div>
<? } ?>
