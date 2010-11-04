<?php
	
function myDebug($var) {
	echo "<div class='tall left'>";
	debug($var);
	echo "</div>";	
}

function timer($name = 0, $action) {
    global $a;
	global $total;
	switch ($action) {
		case 'start' :
			$a[$name] = microtime(true);
			return;
		case 'stop' :
			$b = microtime(true); 
			$time = $b - $a[$name];
			$a[$name] = $b;
			$total[$name] = isset($total[$name]) ? $total[$name] + $time : $time;
			return (string)$time;
		case 'total' :
			return (string)$total[$name];
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

	$insertIds[$model] = isset($insertIds[$model]) ? $insertIds[$model] + 1 : $id;
	if (isset($data[$model])) {
		$data = $data[$model];
	}
	if (in_array('id',$data)) {
	}
	$qI[$model] = isset($qI[$model]) ? 
		$qI[$model] : array();
	$data['id'] = $insertIds[$model];
	ksort($data);
	$qI[$model][] = $data;
	return $insertIds[$model];
}

function getQueue() {
	global $qI;
	global $qD;

	return array('insert'=>$qI,'delete'=>$qD);
}

function writeCache($path, $data) {
	$old = Cache::read('user_'.Authsome::get('id'));
	$updated = Set::insert($old,$path,$data);
	Cache::write('user_'.Authsome::get('id'),$updated);
}

function readCache($path = null) {
	$all = Cache::read('user_'.Authsome::get('id'));
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
	$all = Cache::read('user_'.Authsome::get('id'));
	$parts = explode('.',$path);
	$data = $all;
	foreach($parts as $part) {
		if (!isset($data[$part])) return false;
		$data = $data[$part];
	}
	return true;
}

function deleteCache($path = null) {
	if ($path) {
		$original = Cache::read('user_'.Authsome::get('id'));
		$updated = Set::remove($original,$path);
		Cache::write('user_'.Authsome::get('id'),$updated);
	} else {
		Cache::delete('user_'.Authsome::get('id'));
	}
}

?>
