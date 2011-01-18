<? $simple = isset($simple) ?>
<? if (!$simple) { ?>
<div class='schedule_message no_print'>
<? } ?>
<? 
$schedule = $session->read('Schedule');
$userRoles = Set::combine(Authsome::get('Role'),'{n}.id','{n}.name');

if (isset($area['RequestArea'])) {
	if ($area['RequestArea']['id'] < 0) {
		echo "<span style='color:green'>Editing:</span> {$area['RequestArea']['name']} Request Form";
		echo $html->link(
			'Submit',
			array('controller' => 'RequestAreas', 'action' => 'submit', $area['RequestArea']['id']),
			array(
				'class' => 'button',
				'confirm' => "Submit {$area['RequestArea']['name']} Request Form?",
				'title' => 'Submit Request Form'
			)
		);
	} else {
		echo "<span style='color:blue'>Viewing:</span> {$area['RequestArea']['name']} Request Form";
		if(in_array($area['RequestArea']['id'],
		Set::combine(Authsome::get('Manager'),'{n}.id','{n}.area_id'))) {
			echo " (Submitted)" . $html->link(
				'Edit',
				array('controller' => 'RequestAreas', 'action' => 'edit', $area['RequestArea']['id'],true),
				array(
					'class' => 'button'
				)
			);
		}
	}
} else {
	$message = $schedule['latest'] ? "" : ($simple? '' : "<span style='color:blue'>Viewing an old schedule: </span>");
	$message = $schedule['username'] != '' ? ($simple? '' : "Viewing: ") : $message;
	$message = $schedule['editable'] ? ($simple? '' : "<span style='color:green'>Editing: </span>") : $message; 
	if (in_array('operations',$userRoles)) {
		$title = ($schedule['username'] != '') ?
			$schedule['editable'] ? $schedule['name'] : 
				$schedule['name']." (".$schedule['username'].")" : 
			"Publishd on " . $time->format('F jS, Y g:ia',$schedule['updated']);
		echo $message.($simple? $title : ' '.$this->ajax->link(
			$title,
			array('controller'=>'schedules','action'=>'published'),
			array(
				'escape'=>false,
				'update' => 'dialog_content',
				'complete' => "openDialog('published',true,'bottom')",
				'id' =>'published',
				'title' => 'View Published Schedules...'
			)
		));
	} else {
		$message .= "Published on " . $time->format('F jS, Y g:ia',$schedule['updated']);
		echo ($simple? $message : ' '.$this->ajax->link(
			$message,
			array('controller'=>'schedules','action'=>'published'),
			array(
				'escape'=>false,
				'update' => 'dialog_content',
				'complete' => "openDialog('published',true,'bottom')",
				'id' =>'published',
				'title' => 'View Published Schedules...'
			)
		));
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
</div>
<? } ?>
