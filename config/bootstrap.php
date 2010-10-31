<?php
	
function myDebug($var) {
	echo "<div class='tall left'>";
	debug($var);
	echo "</div>";	
}

function timer($name = 0, $action) {
    static $a;
	static $total;
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
?>
