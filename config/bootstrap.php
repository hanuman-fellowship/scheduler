<?php
	
if (!function_exists('array_replace'))
{
  function array_replace( array &$array, array &$array1 )
  {
    $args = func_get_args();
    $count = func_num_args();

    for ($i = 0; $i < $count; ++$i) {
      if (is_array($args[$i])) {
        foreach ($args[$i] as $key => $val) {
          $array[$key] = $val;
        }
      }
      else {
        trigger_error(
          __FUNCTION__ . '(): Argument #' . ($i+1) . ' is not an array',
          E_USER_WARNING
        );
        return NULL;
      }
    }

    return $array;
  }
}

function myDebug($var) {
	echo "<div class='tall left'>";
	debug($var);
	echo "</div>";	
}


/**
 * start the timer
 */
function start($name = 0) {
	timer($name,'start');
}

/**
 * stop the timer
 */
function stop($name = 0) {
	timer($name,'stop');
}

function total() {
	global $totals;
	myDebug($totals);
}

function timer($name,$action) {
    global $a;
	global $totals;
	switch ($action) {
		case 'start' :
			$a[$name] = microtime(true);
			return;
		case 'stop' :
			$b = microtime(true); 
			$time = $b - $a[$name];
			$a[$name] = $b;
			$totals[$name] = isset($totals[$name]) ? $totals[$name] + $time : $time;
			return (string)$time;
		case 'total' :
			return (string)$totals[$name];
	}
}

function getInsertId($model) {
	global $insertIds;

	return isset($insertIds[$model]) ? $insertIds[$model] : false;
}

function qDeleteAdd($model,$id) {
	global $qD;

	$qD[$model][] = $id;
}

function qInsertAdd($model, $data, $id) {
	global $qI;
	global $insertIds; // keep an array of latest ids for each model

	if ($id) {
		$insertIds[$model] = isset($insertIds[$model]) ? $insertIds[$model] + 1 : $id;
		$qI[$model] = isset($qI[$model]) ? 
			$qI[$model] : array();
		$data['id'] = $insertIds[$model];
	}
	ksort($data);
	$qI[$model][] = $data;
	return isset($insertIds[$model]) ? $insertIds[$model] : $data['id'];
}

function getQueue() {
	global $qI;
	global $qD;

	$queue = array('insert'=>$qI,'delete'=>$qD);
	unset($GLOBALS['qI'], $GLOBALS['qD']);
	return $queue;
}

function setScheduleId($id) {
	global $schedule_id;
	$schedule_id = $id;
}

function scheduleId() {
	global $schedule_id;
	return $schedule_id;
}

function writeCache($path, $data) {
	global $schedule_id;

	$old = Cache::read(Authsome::get('id').'_'.$schedule_id);
	$updated = Set::insert($old,$path,$data);
	Cache::write(Authsome::get('id').'_'.$schedule_id,$updated);
}

function readCache($path = null) {
	global $schedule_id;

	$all = Cache::read(Authsome::get('id').'_'.$schedule_id);
	if ($path) {
		$parts = explode('.',$path);
		$data = $all;
		foreach($parts as $part) {
			$data = $data[$part];
		}
		return $data;
	} else {
		return $all;
	}

}


function checkCache($path) {
	global $schedule_id;

	$all = Cache::read(Authsome::get('id').'_'.$schedule_id);
	$parts = explode('.',$path);
	$data = $all;
	foreach($parts as $part) {
		if (!isset($data[$part])) return false;
		$data = $data[$part];
	}
	return true;
}

function deleteCache($path = null) {
	global $schedule_id;

	if ($path) {
		$original = Cache::read(Authsome::get('id').'_'.$schedule_id);
		$updated = Set::remove($original,$path);
		Cache::write(Authsome::get('id').'_'.$schedule_id,$updated);
	} else {
		Cache::delete(Authsome::get('id').'_'.$schedule_id);
	}
}

?>
