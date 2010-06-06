<h2><?php echo $this->pageTitle = 'Merge Branch'; ?></h2>
<?
foreach($schedules as $schedule) {
	if (!in_array($schedule['Schedule']['id'],array($schedule_id, $parent_id))) {
		echo $html->link($schedule['Schedule']['name'],array($schedule['Schedule']['id']));
		echo '<br/>';
	}
}	
?>