<table width="774" border="0" align="center" cellpadding="0" cellspacing="0"> 
	<tr> 
		<td width="99" rowspan="2"> 
			<div align="right"> 
				<p>Manager: </p> 
			</div>
		</td> 
		<td width="9" rowspan="2">
			&nbsp;
		</td> 
		<td class="title" width="144" rowspan="2">
			<?=$role->wrap(
					$area['Area']['manager'], array(
						'operations' => array('<b>','</b>'),
						''           => array('<i>','</i>')
					)
				);?>
		</td> 
		<td width="222" rowspan="2"> 
			<div align="center" class="title"> 
				<span id='area_name'>
				<?=$role->link($area['Area']['name'],array(
					'operations' => array(
						'url' => array('action'=>'edit',$area['Area']['id']),
						'attributes'=>array(
							'update'=>'dialog_content',
							'complete'=>"openDialog('area_name','#8DBBD5')"
						)
					)
				),'ajax');?>
				</span><br />
				Schedule
			</div>
		</td> 
		<td width="107">
			<div align="right">
			</div>
		</td> 
		<td width="15">
			&nbsp;
		</td> 
		<td width="178">
			<span style="font-size:24px;"> 
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
		<? if (Authsome::get('role') == 'operations') { ?>
		<td id="<?=$slot_num.'_'.$day?>" onmouseover='showAddShift("<?=$slot_num ?>","<?=$day ?>")' onmouseout='hideAddShift("<?=$slot_num.'_'.$day?>")' > 
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
		<td>
		<? } ?>
			<div align="center" class="shift"> 
				<p> 
		<? foreach ($area['Shift'] as $shift) { ?>
					<?=$schedule->displayAreaShift($shift,$bounds['bounds'][$slot_num][$day],$day);?>
		<? } ?>
				</p> 
			</div> 
		</td> 
	<? } ?>
	</tr>
<? } ?>
	<tr> 
		<td align="center" height="13" colspan="8" bordercolor="#000000" style="padding:3px;"> 
			<?=$schedule->displayAreaFloating($area['FloatingShift']);?>

<!-- now that the total hours are added up, sneak them in at the top -->
<script type="text/javascript">
	document.getElementById('total_hours').innerHTML = <?=$schedule->total_hours['total'];?>;
</script>

			<br/>
			<a class="extra_blank" id="hide" href="javascript:openpopup('add_extra.php','Extra','width=580,height=208')"> 
				<span id="no_print">
					Click here to assign extra hours
				</span> 
			</a> 
		</td> 
	</tr> 
</table> 