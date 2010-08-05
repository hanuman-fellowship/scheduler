<?php
$database = mysql_connect('localhost', 'root', 'root') or trigger_error(mysql_error(),E_USER_ERROR);
mysql_select_db('scheduler_public', $database);

/////////////
die;
/////////////



// areas

$query = "INSERT INTO krishna.areas (name,short_name,manager,id,notes,schedule_id)
	(SELECT name,short_name,incharge,id,notes,sch_id  FROM scheduler_public.areas)";
mysql_query($query,$database);


// assignments

$query = "INSERT INTO krishna.assignments (person_id,shift_id,schedule_id)
	(SELECT person,shift,sch_id FROM scheduler_public.assign)";
mysql_query($query,$database);


// constant shifts

$get = mysql_query("SELECT * FROM scheduler_public.constants");
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
		'{$shift_row['ysc']}',
		'{$shift_row['name']}',
		'{$shift_row['day']}',
		'{$start}',
		'{$end}',
		'1',
		'{$shift_row['length']}',
		'{$shift_row['sch_id']}'
	)";

	if (!mysql_query($query,$database)) {
		die('Error: ' . mysql_error()."<br>".$query);
	}
}

// floating shifts

$query = "INSERT INTO krishna.floating_shifts (id,person_id,area_id,hours,note,schedule_id)
	(SELECT id,person,area,hours,other,sch_id FROM scheduler_public.extra)";
mysql_query($query,$database);


// off days

$query = "INSERT INTO krishna.off_days (day_id,person_id,schedule_id)
	(SELECT day,person,sch_id FROM scheduler_public.dayoff)";
if (!mysql_query($query,$database)) {
	die('Error: ' . mysql_error()."<br>".$query);
}


// people

$get = mysql_query("SELECT * FROM scheduler_public.people");
$people_ids = array();
while($people = mysql_fetch_array($get)) {
	$query = "INSERT INTO krishna.people_schedules (person_id,resident_category_id,schedule_id)
		VALUES (
			'{$people['id']}',
			'{$people['ysc']}',
			'{$people['sch_id']}'
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

$get = mysql_query("SELECT * FROM scheduler_public.shifts");
while($shift_row = mysql_fetch_array($get)) {
	$times = array('start','end');
	$shift_row['start'] = $shift_row['time'];
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
		'{$shift_row['area']}',
		'{$shift_row['day']}',
		'{$start}',
		'{$end}',
		'{$shift_row['people']}',
		'{$shift_row['sch_id']}'
	)";

	if (!mysql_query($query,$database)) {
		die('Error: ' . mysql_error()."<br>".$query);
	}
}

// schedules

$get = mysql_query("SELECT * FROM krishna.schedules WHERE krishna.schedules.name = 'Published' limit 1");
$latest = mysql_fetch_array($get);	
$latest_id = $latest['id'];

$get = mysql_query("SELECT * FROM scheduler_public.schedule");
while($schedule = mysql_fetch_array($get)) {
	$updated = date('Y-m-d H:i:s', $schedule['date']);
	$query = "INSERT INTO krishna.schedules (id,name,updated)
		VALUES (
			'{$schedule['id']}',
			'Published',
			'{$updated}'
		)";
	if (!mysql_query($query,$database)) {
		die('Error: ' . mysql_error()."<br>".$query);
	}
	foreach(array('boundaries','days','resident_categories','slots') as $table) {
		$get2 = mysql_query("SELECT * from krishna.{$table} limit 1");
		$fields = array_keys(mysql_fetch_assoc($get2));	
		$field_list = 'schedule_id';
		foreach($fields as $field) {
			$field_list .= ($field == 'schedule_id') ? '' : ','.$field; 
		}
		$get3 = mysql_query("SELECT * FROM krishna.{$table} WHERE krishna.{$table}.schedule_id = '{$latest_id}'");
		while($row = mysql_fetch_assoc($get3)) {
			$values = "'{$schedule['id']}'";
			foreach($row as $key => $val) {
				$values	.= ($key == 'schedule_id') ? '' : ",'{$val}'";
			}
			$query =  "INSERT INTO krishna.{$table} ({$field_list}) VALUES ({$values})";
			if (!mysql_query($query,$database)) {
				die('Error: ' . mysql_error()."<br>".$query);
			}
		}
	}
}


?>
