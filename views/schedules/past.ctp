<fieldset>
	<legend><?php __('Past Schedules');?></legend>
<div class='tall left' style='width:30em'>
<?  $root = $this->html->url('/'); ?>
<table width='100%'>
	<tr>
		<td><b>Name</b><hr/></td>
		<td style='text-align:right'><b>Effective</b><hr/></td>
	</tr>
<?  foreach($schedules as $id => $sched) { ?>
	<tr>
		<td>
	<? foreach(array('right'=>'','down'=>'none') as $direction => $display) { ?>
		<?=$this->html->image("arrow_{$direction}.png",array(
			'style'=>"cursor:pointer;width:9px;height:9px;display:{$display}",
			'onclick'=>"swap('s{$id}right','s{$id}down');$('s{$id}list').toggle()",
			'id' => "s{$id}{$direction}"
		))?>
	<? } ?>
	<?=$this->html->link($sched['ScheduleGroup']['name'],
		array('controller' => 'scheduleGroups','action'=>'select',$sched['ScheduleGroup']['id']),
		array(
			'onclick' => 'wait()',
			'onmouseover' => "$('s{$id}list').down('a').style.backgroundColor='#FFF8BA'",
			'onmouseout' => "$('s{$id}list').down('a').style.backgroundColor=''"
		)
	)?><br>
		<div id="s<?=$id?>list" style='margin-left:2em;display:none'>
			<? foreach($sched['Schedule'] as $published) { ?>
				<?=$this->html->link(
					$time->format('F jS, Y g:ia',$published['updated']),
					array('controller'=>'schedules','action'=>'select',$published['id']),
					array('onclick' => 'wait()')
				)?><br>
			<? } ?>
		</div>
		</td>
		<td valign='top' style='text-align:right'>
		<?=$schedule->displayEffective($sched['ScheduleGroup']);?>
		</td>
	</tr>
<? } ?>
</table>

</div>
</fieldset>
<?=$this->element('message');?>
