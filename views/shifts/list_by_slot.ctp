<fieldset>
	<legend><?php __('Assign Shift');?></legend>
<span class='select_shift'>
<?=$day."<br><br>";?>
<?
foreach($shifts['unassigned'] as $shift) {
	echo $html->link($shift['Shift']['name'],array('controller'=>'assignments','action'=>'assign',$shift['Shift']['id'],$person_id),array(
		'onclick'=>'saveScroll()',
		'escape'=>false
	)) . '<br>';
}
foreach($shifts['assigned'] as $shift) {
	foreach($shift['Assignment'] as $assignment) {
		echo $html->link(
			"<span class='taken'>{$shift['Shift']['name']}</span> <span class='menu_RC_{$assignment['Person']['PeopleSchedules']['resident_category_id']}'>({$assignment['Person']['name']})</span>",array('controller'=>'assignments','action'=>'swap',$shift['Shift']['id'],$assignment['Person']['id'],$person_id),array(
		'onclick'=>'saveScroll()',
		'escape'=>false
	)) . '<br>';
	}
}
?>
</span>
</fieldset>
