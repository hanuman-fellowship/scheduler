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

function getId($model) {
	global $ids;
	return isset($ids[$model]) ? $ids[$model] : false;
}

function updateBuffer($model, $data, $id) {
	global $buffer;
	global $ids; // keep an array of latest ids for each model

	$ids[$model] = isset($ids[$model]) ? $ids[$model] + 1 : $id;
	if (isset($data[$model])) {
		$data = $data[$model];
	}
	if (in_array('id',$data)) {
	}
	$buffer[$model] = isset($buffer[$model]) ? 
		$buffer[$model] : array();
	$data['id'] = $ids[$model];
	ksort($data);
	$buffer[$model][] = $data;
	return $ids[$model];
}

function getBuffer() {
	global $buffer;
	return $buffer;
}
?>
