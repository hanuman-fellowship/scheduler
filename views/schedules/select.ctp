<fieldset>
	<legend><?php __('Select Schedule');?></legend>
	<div class='tall'>
	<div style='clear:both'>
<?
	$latest_selected = $session->read('Schedule.latest') ? 
		'selected' :
		'';
	echo $html->link('Latest Published',
		array('latest'),
		array(
			'onClick'=>'wait()',
			'class'=> $latest_selected
		)
	);
	echo "</div>";
?>
	<div class='left' style='float:left;padding:10px'>
	<b>My Schedules</b><br/>
<?
	foreach($schedules['mine'] as $schedule) {
		$mine_selected = ($schedule['Schedule']['id'] == $schedule_id) ? 
			'selected' :
			'';
		echo $html->link($schedule['Schedule']['name'],
			array($schedule['Schedule']['id']),
			array(
				'onClick'=>'wait()',
				'class'=> $mine_selected
			)
		);
		echo '<br/>';
	}
	?>
	</div>
	<div class='left' style='float:left;padding:10px'>
	<b>Other Schedules</b><br/>
	<?
	foreach($schedules['all'] as $schedule) {
		if( $schedule['Schedule']['user_id'] == Authsome::get('id') ||
		$schedule['Schedule']['user_id'] == 0) {
			continue;
		}
		$other_selected = ($schedule['Schedule']['id'] == $schedule_id) ? 
			'selected' :
			'';
		echo $html->link(
			"{$schedule['Schedule']['name']} ({$schedule['User']['username']})",
			array($schedule['Schedule']['id']),
			array(
				'onClick'=>'wait()',
				'class'=> $other_selected
			)
		);
		echo '<br/>';
	}
	?>
	</div>
	</div>
</fieldset>
<?=$this->element('message');?>
