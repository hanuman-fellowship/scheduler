<fieldset>
	<legend><?php __('Merge');?></legend>
	Choose a schedule to import changes from:<hr>
	<div class='tall left'>
<?
foreach($schedules as $schedule) {
	if (!in_array($schedule['Schedule']['id'],array($schedule_id, $parent_id))) {
		echo $ajax->link($schedule['Schedule']['name'],
			array($schedule['Schedule']['id']),
			array(
				'before'=>'wait()',
				'update'=>'dialog_content',
			)
		);
		echo '<br/>';
	}
}	
?>
</div>
</fieldset>
<?=$this->element('message');?>
