<div class='schedule_message'>
<? 
$role = Authsome::get('role');
$latest = $session->read('Schedule.latest') ? "" : "<span style='color:blue'>Viewing an old schedule: </span>";
if ($role == '') {
	echo ' '.$this->ajax->link(
		$latest."Publishd on " . $time->format('F jS, Y g:ia',$session->read('Schedule.updated')),
		array('controller'=>'schedules','action'=>'past'),
		array('escape'=>false,'update' => 'dialog_content', 'complete' => "openDialog('past',true,'bottom')", 'id' =>'past')
	);

}
if ($role == 'operations') {
	if ($session->read('Schedule.editable')) {
		echo "Editing: ".$session->read('Schedule.name');
	} else {
		echo "Viewing: ".$session->read('Schedule.name');
		if ($session->read('Schedule.username') != '') {
			echo " (".$session->read('Schedule.username').")";
		}
	}
}
?>
</div>
