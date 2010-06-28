<table width="774" border="0" align="center" cellpadding="0" cellspacing="0"> 
	<tr> 
		<td width="99" rowspan="2"> 
			<div align="right"> 
				<p>
				<?= (isset($area)) ?
				'Manager: ' :  
				'Total Hours: ';?>
				</p> 
			</div>
		</td> 
		<td width="9" rowspan="2">
			&nbsp;
		</td> 
		<td class="title" <?= (isset($person)) ? 'id="total_hours"' : '';?> width="144" rowspan="2">
			<?= (isset($area)) ?
				$area['Area']['manager'] :
				'';?>
		</td> 
		<td width="222" rowspan="2"> 
			<div align="center" class="title"> 
			<? if (isset($area)) { ?>
				<span id='area_name'>
				<?=$role->link($area['Area']['name'],array(
					'operations' => array(
						'url' => array('action'=>'edit',$area['Area']['id']),
						'attributes'=>array(
							'update'=>'dialog_content',
							'complete'=>"openDialog('area_name','#8DBBD5')"
						),
						'ajax'
					)
				));?>
				</span>
			<? } else { ?>
				<?= $person['ResidentCategory']['name'] ?>
			<? } ?>
				<br />
				Schedule
			</div>
		</td> 
		<td width="107">
			<div align="right">
			<?= (isset($person)) ? 'Name:' : '';?>
			</div>
		</td> 
		<td width="15">
			&nbsp;
		</td> 
		<td width="178">
			<span style="font-size:24px;"> 
			<?= (isset($person)) ? $person['Person']['name'] : '';?>
			</span>
		</td> 
	</tr> 
	<tr> 
    	<td> 
			<div align="right">
				<span class="style2">
					Effective:
				</span>
			</div>
		</td> 
		<td>
			&nbsp;
		</td> 
		<td> 
			January 7th - April 4th
		</td> 
	</tr> 
</table> 
<table style="" width="774" border="2" align="center" cellpadding="0" cellspacing="0"> 
	<tr> 
		<td width="75" bordercolor="#000000"> 
		</td> 
<? foreach ($bounds['days'] as $day) { ?>
		<td width="75" bordercolor="#000000"> 
			<div align="center"> 
				<p><?=$day?></p> 
			</div> 
		</td>
<? } ?>
	</tr>	
	<tr> 
<? foreach ($bounds['slots'] as $slot_num => $slot) { ?>
		<td width="75" height="60" bordercolor="#000000"> 
			<div align="center"> 
				<p><?=$slot?></p> 
			</div> 
		</td> 
	<? foreach ($bounds['days'] as $day => $d) { ?>
		<? $off_day = (isset($person)) ? $schedule->offDays($person['OffDay'], $day) : ''; ?>
		<? if (Authsome::get('role') == 'operations' && (isset($area))) { ?>
		<td <?=$off_day;?> id="<?=$slot_num.'_'.$day?>" onmouseover='showAddShift("<?=$slot_num ?>","<?=$day ?>")' onmouseout='hideAddShift("<?=$slot_num.'_'.$day?>")' > 
			<?=$ajax->link(
				' + ',
				array('controller'=>'shifts','action'=>'add',$area['Area']['id'],$day,str_replace(":","-",$bounds['bounds'][$slot_num][$day]['start'])),
				array(
					'id'=>"add_{$slot_num}_{$day}", 
					'style'=>"display:none;font-size:10pt;position:absolute;padding:3px;background-color:#DDDDDD",
					'update' => 'dialog_content',
					'complete' => "openDialog('{$slot_num}_{$day}','#ACBFDA','true')"
				)
			);?>
		<? } else { ?>
		<td <?=$off_day;?> >
		<? } ?>
			<div align="center" class="shift"> 
				<p> 
		<? if (isset($area)) { ?>
			<? foreach ($area['Shift'] as $shift) { ?>
						<?=$schedule->displayAreaShift($shift,$bounds['bounds'][$slot_num][$day],$day);?>
			<? } ?>
		<? } else { ?>
			<? foreach ($person['Assignment'] as $assignment) { ?>
						<?=$schedule->displayPersonShift($assignment['Shift'],$bounds['bounds'][$slot_num][$day],$day);?>
			<? } ?>		
		<? } ?>
				</p> 
			</div> 
		</td> 
	<? } ?>
	</tr>
<? } ?>
	<tr> 
	<? if (isset($person)) { ?>
		<td height="26" bordercolor="#000000">
			<div align="center">
				Hours
			</div>
		</td> 
	<? foreach ($bounds['days'] as $day => $d) { ?>	 
		<td align="center" height="26" bordercolor="#000000">
			<?=$schedule->total_hours[$day];?>
		</td> 
 	<? } ?>
 	</tr> 
	<tr> 
	<? } ?>	
		<td align="center" height="13" colspan="8" bordercolor="#000000" style="padding:3px;"> 
		<? if (isset($area)) { ?>
			<?=$schedule->displayAreaFloating($area['FloatingShift']);?>
		<? } else { ?>
			<?=$schedule->displayPersonFloating($person['FloatingShift']);?>
			<?// now that the total hours are added up, sneak them in at the top
			?>
			<script type="text/javascript">
				document.getElementById('total_hours').innerHTML = <?=$schedule->total_hours['total'];?>;
			</script>
		<? } ?>
			<br/>
			<a class="extra_blank" id="hide" href="javascript:openpopup('add_extra.php','Extra','width=580,height=208')"> 
				<span id="no_print">
					Click here to assign extra hours
				</span> 
			</a> 
		</td> 
	</tr> 
	<? if (isset($person)) { ?>
	<tr> 
		<td align="center" height="13" colspan="8" bordercolor="#000000" style="padding:3px;">
			<?=$schedule->displayLegend();?>
		</td> 
	</tr> 
	<? } ?>	
</table> 