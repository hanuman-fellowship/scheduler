<h2><?php echo $this->pageTitle = 'Select Branch'; ?></h2>
<?
foreach($schedules as $schedule) {
	$style = ($schedule['Schedule']['id'] == $schedule_id) ? 
		array('<b>','</b') :
		array(null,null);
	echo $style[0];
	echo $html->link($schedule['Schedule']['name'],array($schedule['Schedule']['id']));
	echo $style[1];
	echo '<br/>';
}
?>