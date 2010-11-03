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
	$parts = explode('.',$path);
	$old = Cache::read(Authsome::get('id').$parts[0]);
	if (!is_array($old)) $old = '';
	$container = array($parts[0]=>$old);
	$updated = Set::insert($container,$path,$data);
	Cache::write(Authsome::get('id').$parts[0],$updated[$parts[0]]);
}

function readCache($path) {
	$parts = explode('.',$path);
	$temp = Cache::read(Authsome::get('id').$parts[0]);
	array_shift($parts);
	$data = $temp;
	foreach($parts as $part) {
		$data = $temp[$part];
	}
	return $data;
}

function deleteCache($path) {
	$parts = explode('.',$path);
	if (count($parts) > 1) {
		$old = Cache::read(Authsome::get('id').$parts[0]);
		$container = array($parts[0]=>$old);
		$updated = Set::remove($container,$path);
		Cache::write(Authsome::get('id').$parts[0],$updated[$parts[0]]);
	} else {
		Cache::delete(Authsome::get('id').$path);
	}
}

?>
