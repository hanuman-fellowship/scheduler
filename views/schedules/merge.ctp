<fieldset>
	<legend><?php __('Merge Schedule');?></legend>
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
</fieldset>
<?=$this->element('message');?>
