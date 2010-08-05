<div class='schedule_message'>
<? 
$role = Authsome::get('role');
if ($role == '') {
	echo ' '.$this->ajax->link(
		"Publishd on " . $time->format('F jS, Y g:ia',$session->read('Schedule.updated')),
		array('controller'=>'schedules','action'=>'past'),
		array('update' => 'dialog_content', 'complete' => "openDialog('past',true,'bottom')", 'id' =>'past')
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
