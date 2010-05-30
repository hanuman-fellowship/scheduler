<? $this->pageTitle=$person['Person']['name']."'s Schedule"; ?>
<body class="RC_<?=$person['Person']['resident_category_id']?>" onclick="hide_tools();hide_login_who()">  
 
 
<table width="774" border="0" align="center" cellpadding="0" cellspacing="0"> 
	<tr> 
		<td width="99" rowspan="2"> 
			<div align="right"> 
				<p>Total Hours: </p> 
			</div>
		</td> 
		<td width="9" rowspan="2">
			&nbsp;
		</td> 
		<td class="title" id="total_hours" width="144" rowspan="2">
			
		</td> 
		<td width="222" rowspan="2"> 
			<div align="center" class="title"> 
				<?= $person['ResidentCategory']['name'] ?><br />
				Schedule
			</div>
		</td> 
		<td width="107">
			<div align="right">
				Name:
			</div>
		</td> 
		<td width="15">
			&nbsp;
		</td> 
		<td width="178">
			<span style="font-size:24px;"> 
				<?= $person['Person']['name'] ?>
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
<? foreach ($days as $day) { ?>
		<td width="75" bordercolor="#000000"> 
			<div align="center"> 
				<p><?=$day?></p> 
			</div> 
		</td>
<? } ?>
	</tr>	
	<tr> 
<? foreach ($slots as $slot_num => $slot) { ?>
		<td width="75" height="60" bordercolor="#000000"> 
			<div align="center"> 
				<p><?=$slot?></p> 
			</div> 
		</td> 
	<? foreach ($days as $day => $d) { ?>
		<td <?=$schedule->offDays($person['OffDay'], $day);?>> 
			<div align="center" class="shift"> 
				<p> 
		<? foreach ($person['Assignment'] as $assignment) { ?>
					<?=$schedule->displayPersonShift($assignment['Shift'],$bounds[$slot_num][$day],$day);?>
		<? } ?>
				</p> 
			</div> 
		</td> 
	<? } ?>
	</tr>
<? } ?>
	<tr> 
		<td height="26" bordercolor="#000000">
			<div align="center">
				Hours
			</div>
		</td> 
	<? foreach ($days as $day => $d) { ?>	 
		<td align="center" height="26" bordercolor="#000000">
			<?=$schedule->total_hours[$day];?>
		</td> 
 	<? } ?>
 	</tr> 
	<tr> 
		<td align="center" height="13" colspan="8" bordercolor="#000000" style="padding:3px;"> 
			<?=$schedule->displayPersonFloating($person['FloatingShift']);?>

<?// now that the total hours are added up, sneak them in at the top ?>
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
	<tr> 
		<td align="center" height="13" colspan="8" bordercolor="#000000" style="padding:3px;">
			<?=$schedule->displayLegend();?>
		</td> 
	</tr> 
</table> 
</body>