<? $simple = isset($simple) ?>
<? 
$schedule = $session->read('Schedule');
$userRoles = Set::combine(Authsome::get('Role'),'{n}.id','{n}.name');
$now = date('Y-m-d H:i:s');
$published = ($schedule['name'] == 'Published');
?>
<? if (!$simple) { ?>
	<?=$html->tag('div',null,array(
		'class' => 'schedule_message ' . ($published ? '' : 'no_print'),
	))?>
	<?=$html->tag('span',null,array(
		'id' => 'group_name',
	))?>
	<?= $published ? '' : '<i>Based on: ' ?>
	<?= ($schedule['request']) ? 'AREA REQUEST FORM' : $schedule['Group']['name']?>
	<?= $published ? '' : '</i>' ?>
	<? if ($published) { ?>
		<? if ($schedule['Group']['start'] > $now) { ?>
			<?= "<span class='alert no_print'>".$this->html->image('small_alert_icon.gif')?>
			<?= "<span>This schedule is not yet in effect</span></span>" ?>
		<? } ?>
		<? if ($schedule['Group']['end'] < $now) { ?>
			<?= "<span class='alert no_print'>".$this->html->image('small_alert_icon.gif')?>
			<?= "<span>This schedule is no longer in effect</span></span>" ?>
	<? } ?>
<? } ?>
	</span>
<? } ?>
<? if ($session->read('Schedule.Group.alternate') && Authsome::get('id') == '') { ?>
	<?= $this->ajax->link(
		'ALTERNATE SCHEDULES',
		array('controller'=>'schedules','action'=>'alternate'),
		array(
			'update' => 'dialog_content',
			'complete' => "openDialog('alternate',true,'bottom')",
			'id' => 'alternate'
		)
	) ?>
<? } ?>
<?= $simple? '' : "<span id='published'>"?>
<?
if ($schedule['request']) {
	if ($schedule['request'] == 2) {
		echo "<span style='color:green'>Editing:</span> {$schedule['name']}";
		echo $html->link(
			'Submit',
			array('controller' => 'schedules', 'action' => 'submitRequest'),
			array(
				'class' => 'button',
				'confirm' => "Submit {$area['Area']['name']} Request Form?",
				'title' => 'Submit Request Form'
			)
		);
	} else {
		echo "<span style='color:blue'>Viewing:</span> {$area['Area']['name']} Request Form";
		if(in_array($area['Area']['id'],
		Set::combine(Authsome::get('Manager'),'{n}.id','{n}.area_id'))) {
			echo " (Submitted)";
		}
	}
} else {
	$message = $schedule['latest_in_group'] ? "" : ($simple? '' : "<span style='color:blue'>Viewing an old version: </span>");
	$message = $schedule['username'] != '' ? ($simple? '' : "Viewing: ") : $message;
	$message = $schedule['editable'] ? ($simple? '' : "<span style='color:green'>Editing: </span>") : $message; 
	if (in_array('operations',$userRoles)) {
		$title = ($schedule['username'] != '') ?
			$schedule['editable'] ? $schedule['name'] : 
				$schedule['name']." (".$schedule['username'].")" : 
			"Published on " . $time->format('F jS, Y g:ia',$schedule['updated']);
		echo $message.$title;
	} else {
		$message .= "Published on " . $time->format('F jS, Y g:ia',$schedule['updated']);
		echo $message;
	}
echo $schedule['editable'] ? 
	($simple? '' : $ajax->link(
		'Publish',
		array('controller' => 'schedules', 'action' => 'publish'),
		array(
			'class' => 'button',
			'update' => 'dialog_content',
			'complete' => "openDialog('publish',true,'bottom')",
			'id' => 'publish'
		)
	))
	: '';
}
?>
<? if (!$simple) { ?>
</span>
</div>
<? } ?>
