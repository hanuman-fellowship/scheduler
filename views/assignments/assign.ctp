<?
foreach($people as $person) {
	if ($person['available']) {
		echo $html->link($person['name'],array($shift,$person['id'])) . '<br>';
	}
}


?>