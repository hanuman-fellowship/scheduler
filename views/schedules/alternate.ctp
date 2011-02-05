<fieldset>
	<legend><?php __('Select Alternate Schedule');?></legend>
<?
echo "<div class='tall left'>";
foreach($alternates as $alternate) {
	echo $html->link(
		$alternate['ScheduleGroup']['name'],
		array('controller'=>'ScheduleGroups','action'=>'select',$alternate['ScheduleGroup']['id']),
		array('onclick'=>'wait()')).
	'<br/>';
}
echo "</div>";
?>
</fieldset>
<?=$this->element('message');?>
