<div class='schedule_message'>
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
	$latest = $schedule['latest'] ? "" : "<span style='color:blue'>Viewing an old schedule: </span>";
	$latest = $schedule['username'] != '' ? "Viewing: " : $latest;
	$latest = $schedule['editable'] ? "<span style='color:green'>Editing: </span>" : $latest; 
	if (in_array('operations',$userRoles)) {
		echo ' '.$this->ajax->link(
			$latest."Published on " . $time->format('F jS, Y g:ia',$schedule['updated']),
			array('controller'=>'schedules','action'=>'past'),
			array(
				'escape'=>false,
				'update' => 'dialog_content',
				'complete' => "openDialog('past',true,'bottom')",
				'id' =>'past'
			)
		);
	} else {
		$title = ($schedule['username'] != '') ?
			$schedule['editable'] ? $schedule['name'] : 
				$schedule['name']." (".$schedule['username'].")" : 
			"Publishd on " . $time->format('F jS, Y g:ia',$schedule['updated']);
		echo $latest.' '.$this->ajax->link(
			$title,
			array('controller'=>'schedules','action'=>'past'),
			array(
				'escape'=>false,
				'update' => 'dialog_content',
				'complete' => "openDialog('past',true,'bottom')",
				'id' =>'past'
			)
		);
	}
echo $schedule['editable'] ? 
	$html->link(
		'Publish',
		array('controller' => 'schedules', 'action' => 'publish'),
		array(
			'class' => 'button',
			'confirm' => "Publish the schedule \"{$schedule['name']}\"?"
		)
	)
	: '';
}
?>
</div>
