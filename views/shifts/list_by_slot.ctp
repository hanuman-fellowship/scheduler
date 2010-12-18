<fieldset>
	<legend><?php __('Assign Shift');?></legend>
<span class='select_shift'>
<?=$day."<br><br>";?>
<?
$lists = array('available','all');
foreach($lists as $list) {
	?><div class='tall left' id='<?=$list?>' <? if($list == 'all') { ?>style='display:none'<?}?>><?
	foreach($shifts['unassigned'] as $shift) {
		if ($shift['available'] === -1 ) continue; // the person is on that shift, so don't show it
		if ($shift['available'] || $list == 'all') {
			echo $html->link(
				$shift['Shift']['name'],
				array(
					'controller'=>'assignments',
					'action'=>'assign',
					$shift['Shift']['id'],
					$person_id
				),
				array(
					'onclick'=>'wait();saveScroll()',
					'escape'=>false
				)
			) . '<br>';
		}
	}
	foreach($shifts['assigned'] as $shift) {
		if ($shift['available'] === -1 ) continue; // the person is on that shift, so don't show it
		foreach($shift['Assignment'] as $assignment) {
			if ($shift['available'] || $list == 'all') {
				$style = $assignment['Person']['id'] == 0 ?
					'color:#000;font-style:italic' :
					'color:' . $assignment['Person']['PeopleSchedules']['ResidentCategory']['color'];
				echo $html->link(
					"<span class='taken'>
						{$shift['Shift']['name']}
					</span> 
					<span style='{$style}'>
						({$assignment['Person']['name']})
					</span>",
					array(
						'controller'=>'assignments',
						'action'=>'swap',
						$assignment['id'],
						$person_id
					),
					array(
						'onclick'=>'wait();saveScroll()',
						'escape'=>false
					)
				) . '<br>';
			}
		}
	}
	?></div><?
}
?>
<br>
<div style="clear:both;float:right;">
	<input type="checkbox" id="conflictsBox" value="0" onclick="toggleConflicts()" />
	<label for='conflictsBox'>Ignore Conflicts</label>
</div>
</span>
</fieldset>
<?=$this->element('message');?>
