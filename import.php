<?php

if (getcwd() == '/var/www/html') {
	$pathToMysql = "/usr/bin/";
	$mysqlPass = "mYsqlr00t";
} else {
	$pathToMysql = "/Applications/MAMP/Library/bin/";
	$mysqlPass = "root";
}

$database = mysql_connect('localhost', 'root', $mysqlPass) or trigger_error(mysql_error(),E_USER_ERROR);
mysql_select_db('scheduler_public', $database);


if (!isset($_GET['a'])) {
	echo "<a href='import.php?a=0'>Begin Import</a>";
	die;
}

if ($_GET['a'] == '0') {
	echo 'importing areas...<br>';
	$location = "import.php?a=1";
}

if ($_GET['a'] == '1') {

	// initialize database

	$query = "drop database IF EXISTS krishna";
	mysql_query($query,$database);
	$query = "create database krishna";
	mysql_query($query,$database);
	exec("{$pathToMysql}mysql -u root --password={$mysqlPass} krishna < newscheduler/app/config/sql/ready_for_import.sql");

	// areas

	$query = "INSERT INTO krishna.areas (name,short_name,manager,id,notes,schedule_id)
		(SELECT name,short_name,incharge,id,notes,sch_id  FROM scheduler_public.areas)";
	mysql_query($query,$database);
	echo 'importing assignments...<br>';
	$location = "import.php?a=2";
}

if ($_GET['a'] == '2') {
	// assignments

	$query = "INSERT INTO krishna.assignments (person_id,name,shift_id,schedule_id)
		(SELECT person,name,shift,sch_id FROM scheduler_public.assign)";
	mysql_query($query,$database);

	echo 'importing constant shifts...<br>';
	$location = "import.php?a=3";
}

if ($_GET['a'] == '3') {
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

	echo "importing floating shifts...<br>";
	$location = "import.php?a=4";
}

if ($_GET['a'] == '4') {
	// floating shifts

	$query = "INSERT INTO krishna.floating_shifts (id,person_id,area_id,hours,note,schedule_id)
		(SELECT id,person,area,hours,other,sch_id FROM scheduler_public.extra)";
	mysql_query($query,$database);

	echo "importing off days...<br>";
	$location = "import.php?a=5";
}

if ($_GET['a'] == '5') {
	// off days

	$query = "INSERT INTO krishna.off_days (day_id,person_id,schedule_id)
		(SELECT day,person,sch_id FROM scheduler_public.dayoff)";
	if (!mysql_query($query,$database)) {
		die('Error: ' . mysql_error()."<br>".$query);
	}

	echo "importing people...<br>";
	$location = "import.php?a=6";
}

if ($_GET['a'] == '6') {
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
			$query = "INSERT INTO krishna.people (id,first)
				VALUES (
					'{$people['id']}',
					'{$people['name']}'
				)";
			if (!mysql_query($query,$database)) {
				die('Error: ' . mysql_error()."<br>".$query);
			}
		}
	}

	$get = mysql_query("SELECT id FROM scheduler_public.schedule order by id asc limit 1");
	$first = mysql_fetch_array($get);	
	$from = $first['id'];
	$to = $from + 100;
	echo "importing shifts from {$from} to {$to}...<br>";
	$location = "import.php?a=7&from={$from}&to={$to}";
}

if ($_GET['a'] == '7') {
	// shifts
	
	$done = true;
	$get = mysql_query("SELECT * FROM scheduler_public.shifts where sch_id >= {$_GET['from']} and sch_id < {$_GET['to']}");
	while($shift_row = mysql_fetch_array($get)) {
		$done = false;
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
	echo "shifts done up to {$_GET['to']}<br>";
	if (!$done) {
		$from = $_GET['from'] + 100;
		$to = $_GET['to'] + 100;
		$location = "import.php?a=7&from={$from}&to={$to}";
	} else {
		$get = mysql_query("SELECT id FROM scheduler_public.schedule order by id asc limit 1");
		$first = mysql_fetch_array($get);	
		$from = $first['id'];
		$to = $from + 100;
		$location = "import.php?a=8&from={$from}&to={$to}";
	}
}

if ($_GET['a'] == '8') {
	// schedules


	$done = true;
	$get = mysql_query("SELECT * FROM scheduler_public.schedule WHERE id >= {$_GET['from']}  AND id < {$_GET['to']}");
	while($schedule = mysql_fetch_array($get)) {
		$done = false;
		$updated = date('Y-m-d H:i:s', $schedule['date']);
		$getGroup = mysql_query("SELECT name,id from krishna.schedule_groups where name = '{$schedule['name']}'");
		if ($group = mysql_fetch_assoc($getGroup)) {
			$group_id = $group['id'];
		} else {
			$makeGroup = "INSERT INTO krishna.schedule_groups (name,start,end)
				VALUES (
					'{$schedule['name']}',
					'{$updated}',
					'{$updated}'
				)";
			if (!mysql_query($makeGroup,$database)) {
				die('Error: ' . mysql_error()."<br>".$query);
			}
			$getGroup = mysql_query("SELECT id from krishna.schedule_groups where name = '{$schedule['name']}'");
			$group = mysql_fetch_assoc($getGroup);
			$group_id = $group['id'];
		}
		$query = "INSERT INTO krishna.schedules (id,name,updated,schedule_group_id)
			VALUES (
				'{$schedule['id']}',
				'Published',
				'{$updated}',
				'{$group_id}'
			)";
		if (!mysql_query($query,$database)) {
			die('Error: ' . mysql_error()."<br>".$query);
		}

		// delete hanging floating_shifts
		$query = "DELETE FROM krishna.floating_shifts WHERE
			krishna.floating_shifts.schedule_id = '{$schedule['id']}' AND
			krishna.floating_shifts.person_id NOT IN (
				SELECT person_id FROM krishna.people_schedules WHERE
					krishna.people_schedules.schedule_id = '{$schedule['id']}'
			)";
		if (!mysql_query($query,$database)) {
			die('Error: ' . mysql_error()."<br>".$query);
		}

		// boundaries, days, slots
		foreach(array('boundaries','days','slots') as $table) {
			$get2 = mysql_query("SELECT * from krishna.{$table} limit 1");
			$fields = array_keys(mysql_fetch_assoc($get2));	
			$field_list = 'schedule_id';
			foreach($fields as $field) {
				$field_list .= ($field == 'schedule_id') ? '' : ','.$field; 
			}
			$get3 = mysql_query("SELECT * FROM krishna.{$table} WHERE krishna.{$table}.schedule_id = '-1'");
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

		// resident categories
		$this_date = date('Y-m-d H:i:s', $schedule['date']);
		$RC_names = array(
			'1' => 'YSC 1',
			'2' => 'YSC 2'
		);
		$RC_names['3'] = $this_date <= date('Y-m-d H:i:s',strtotime('9/3/08')) ?
			'YSC 3' : 'YSL';
		$RC_names['4'] = $this_date <= date('Y-m-d H:i:s',strtotime('9/4/08')) ?
			'New Resident' : 'Resident';
		if ($this_date > date('Y-m-d H:i:s',strtotime('1/8/08')))
			$RC_names['5'] = 'Intern';
		if ($this_date > date('Y-m-d H:i:s',strtotime('5/9/09')))
			$RC_names['6'] = 'Temporary';
		$values = '';
		foreach ($RC_names as $rcId => $rcName) {
			$values .= "('{$rcId}','{$rcName}','{$schedule['id']}'),";
		}
		$values = substr($values,0,-1);
		$query =  "INSERT INTO krishna.resident_categories (id,name,schedule_id)
			VALUES {$values}";
		if (!mysql_query($query,$database)) {
			die('Error: ' . mysql_error()."<br>".$query);
		}
	}
	echo "schedules done up to {$_GET['to']}<br>";
	if (!$done) {
		$from = $_GET['from'] + 100;
		$to = $_GET['to'] + 100;
		$location = "import.php?a=8&from={$from}&to={$to}";
	} else {
		$location = "import.php?a=9";
	}
}
if ($_GET['a'] == 9) {
	foreach(array('boundaries','days','resident_categories','slots') as $table) {
		$query = "DELETE FROM krishna.{$table} WHERE krishna.{$table}.schedule_id = '-1'";
		if (!mysql_query($query,$database)) {
			die('Error: ' . mysql_error()."<br>".$query);
		}
	}
	$query = "DELETE FROM krishna.schedules WHERE krishna.schedules.id = '-1'";
	if (!mysql_query($query,$database)) {
		die('Error: ' . mysql_error()."<br>".$query);
	}

	echo 'done!';
	die;
}
?>

<script type="text/javascript">
	location.href = "<?=$location?>";
</script>

