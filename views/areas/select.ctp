<?
foreach($areas as $id => $name) {
	echo $html->link($name,array('action'=>'schedule',$id)).'<br/>';
}
?>