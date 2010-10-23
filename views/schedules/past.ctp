<fieldset>
	<legend><?php __('Past Schedules');?></legend>
<div class='tall left' style='width:30em'>
<?  $root = $this->html->url('/'); ?>
<table width='100%'>
	<tr>
		<td><b>Name</b><hr/></td>
		<td><b>Effective</b><hr/></td>
	</tr>
<?  foreach($schedules as $sched) { ?>
	<tr>
		<td>
	<?="<a id='current' onclick='wait()' href='{$root}scheduleGroups/select/{$sched['id']}'>". 
		$sched['name'] ."</a><br>";?>
		</td>
		<td style='text-align:right'>
		<?=$schedule->displayEffective($sched);?>
		</td>
	</tr>
<? } ?>
</table>

</div>
</fieldset>
<?=$this->element('message');?>
