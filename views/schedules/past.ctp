<fieldset>
	<legend><?php __('Past Schedules');?></legend>
<div class='tall left' style='width:15em'>
<?
$current_schedule = $session->read('Schedule.id');

// using html->link() for each url is too slow, so here we get
// the root of the url, and build it manually for each link
$root = $this->html->url('/');
foreach($schedules as $schedule) {
	$current = $schedule['Schedule']['id'] == $current_schedule ? 'current' : '';
	echo "<a id='{$current}' onclick='wait()' href='{$root}schedules/select/{$schedule['Schedule']['id']}'>". 
		$schedule['Schedule']['updated'] ."</a><br>";
}
?>
<?=$this->javascript->codeBlock("
	get('current').scrollIntoView(true);
	get('current').style.fontWeight = 'bold';
	get('current').innerHTML += '&nbsp;&nbsp;<----';
	setScroll();
");?>
</div>
</fieldset>
<?=$this->element('message');?>
