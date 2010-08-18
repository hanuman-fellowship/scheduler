<div class='schedule_message'>
<? 
$schedule = $session->read('Schedule');
$role = Authsome::get('role');
$latest = $schedule['latest'] ? "" : "<span style='color:blue'>Viewing an old schedule: </span>";
$latest = $schedule['username'] != '' ? "Viewing: " : $latest;
$latest = $schedule['editable'] ? "<span style='color:green'>Editing: </span>" : $latest; 
if ($role == '') {
	echo ' '.$this->ajax->link(
		$latest."Publishd on " . $time->format('F jS, Y g:ia',$schedule['updated']),
		array('controller'=>'schedules','action'=>'past'),
		array(
			'escape'=>false,
			'update' => 'dialog_content',
			'complete' => "openDialog('past',true,'bottom')",
			'id' =>'past'
		)
	);

}
if ($role == 'operations') {
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
?>
</div>
