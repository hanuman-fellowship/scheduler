<?php
$database = mysql_connect('localhost', 'root', 'root') or trigger_error(mysql_error(),E_USER_ERROR);
mysql_select_db('export', $database);

/////////////
die;
/////////////

// areas

$query = "INSERT INTO krishna.areas (name,short_name,manager,id,notes,schedule_id)
	(SELECT * FROM export.areas)";
mysql_query($query,$database);


// assignments

$query = "INSERT INTO krishna.assignments (person_id,shift_id,schedule_id)
	(SELECT * FROM export.assignments)";
mysql_query($query,$database);


// constant shifts

$get = mysql_query("SELECT * FROM export.constant_shifts");
while($shift_row = mysql_fetch_array($get)) {
	$times = array('start','end');
	foreach($times as $time) {
		$from_hours = $shift_row[$time] - fmod($shift_row[$time] , 1);
		$from_minutes = (fmod($shift_row[$time] , 1) * 60);
		if ($from_minutes == 0)
			$from_minutes = "";
		else
			$from_minutes = ":" . $from_minutes;
		if ($from_hours > 12 ) {
			$from_hours = $from_hours - 12;
			$from_minutes .= 'pm';
		} else {
			if($from_hours == 12) {
				$from_minutes .= 'pm';
			} else {
				$from_minutes .= 'am';
			}
		}
		$$time = date('H:i:00',strtotime($from_hours.$from_minutes));
	}
	$query = "INSERT INTO krishna.constant_shifts (resident_category_id,name,day_id,start,end,specify_hours,hours,schedule_id)
	VALUES (
		'{$shift_row['resident_category_id']}',
		'{$shift_row['name']}',
		'{$shift_row['day_id']}',
		'{$start}',
		'{$end}',
		'{$shift_row['specify_hours']}',
		'{$shift_row['hours']}',
		'{$shift_row['schedule_id']}'
	)";

	if (!mysql_query($query,$database)) {
		die('Error: ' . mysql_error()."<br>".$query);
	}
}

// floating shifts

$query = "INSERT INTO krishna.floating_shifts (id,person_id,area_id,hours,note,schedule_id)
	(SELECT * FROM export.floating_shifts)";
mysql_query($query,$database);


// off days

$query = "INSERT INTO krishna.off_days (day_id,person_id,schedule_id)
	(SELECT day_id,person_id,schedule_id FROM export.off_days)";
if (!mysql_query($query,$database)) {
	die('Error: ' . mysql_error()."<br>".$query);
}


// people

$get = mysql_query("SELECT * FROM export.people");
$people_ids = array();
while($people = mysql_fetch_array($get)) {
	$query = "INSERT INTO krishna.people_schedules (person_id,resident_category_id,schedule_id)
		VALUES (
			'{$people['id']}',
			'{$people['resident_category']}',
			'{$people['schedule_id']}'
		)";
	if (!mysql_query($query,$database)) {
		die('Error: ' . mysql_error()."<br>".$query);
	}
	if (!in_array($people['id'],$people_ids)) {
		$people_ids[] = $people['id'];
		$query = "INSERT INTO krishna.people (id,name)
			VALUES (
				'{$people['id']}',
				'{$people['name']}'
			)";
		if (!mysql_query($query,$database)) {
			die('Error: ' . mysql_error()."<br>".$query);
		}
	}
}

// shifts

$get = mysql_query("SELECT * FROM export.shifts");
while($shift_row = mysql_fetch_array($get)) {
	$times = array('start','end');
	$shift_row['end'] = $shift_row['start'] + $shift_row['length'];
	foreach($times as $time) {
		$from_hours = $shift_row[$time] - fmod($shift_row[$time] , 1);
		$from_minutes = (fmod($shift_row[$time] , 1) * 60);
		if ($from_minutes == 0)
			$from_minutes = "";
		else
			$from_minutes = ":" . $from_minutes;
		if ($from_hours > 12 ) {
			$from_hours = $from_hours - 12;
			$from_minutes .= 'pm';
		} else {
			if($from_hours == 12) {
				$from_minutes .= 'pm';
			} else {
				$from_minutes .= 'am';
			}
		}
		$$time = date('H:i:00',strtotime($from_hours.$from_minutes));
	}
	$query = "INSERT INTO krishna.shifts (id,area_id,day_id,start,end,num_people,schedule_id)
	VALUES (
		'{$shift_row['id']}',
		'{$shift_row['area_id']}',
		'{$shift_row['day_id']}',
		'{$start}',
		'{$end}',
		'{$shift_row['people']}',
		'{$shift_row['schedule_id']}'
	)";

	if (!mysql_query($query,$database)) {
		die('Error: ' . mysql_error()."<br>".$query);
	}
}



?>
