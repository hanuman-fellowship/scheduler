<div class='schedule_message'>
<? 
$role = Authsome::get('role');
if ($role == '') {
	echo "Publishd on " . $time->format('F jS, Y g:ia',$session->read('Schedule.updated'));
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
