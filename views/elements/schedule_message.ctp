<div class='schedule_message'>
<? 
$role = Authsome::get('role');
if ($role == '') {
	echo "Publishd on " . $time->format('F jS, Y g:ia',$session->read('Schedule.updated'));
}
if ($role == 'operations') {
	if ($session->read('Schedule.editable')) {
		echo "Editing: ";
	} else {
		echo "Viewing: ";
	}
	echo $session->read('Schedule.name');
}
?>
</div>
