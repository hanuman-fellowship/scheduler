<? if (isset($newRequest)) { ?>
	<? $baseUrl = array(
		'controller' => 'schedules',
		'action' => 'newRequest',
		$newRequest['area_id'],
		$newRequest['name']
	) ?>
<? } else { ?>
	<? $baseUrl = array(
		'controller' => 'schedules',
		'action' => 'select'
	) ?>
<? } ?>
<div class='tall left' style='width:30em'>
<?  $root = $this->html->url('/'); ?>
<table width='100%'>
	<tr>
		<td><b>Name</b><hr/></td>
		<td style='text-align:right'><b>Effective</b><hr/></td>
	</tr>
<? $year = date('Y')?>
<? $thisYear = $year?>
<?  foreach($schedules as $id => $sched) { ?>
	<? $schedYear = date('Y', strtotime($sched['ScheduleGroup']['start']))?>
  <tr class='<?=$schedYear < $year? '' : "year{$year}"?>' <?= $thisYear != $year && !($schedYear < $year) ? "style='display:none'" : ''?>>
		<td>
	<? if ($schedYear < $year) { ?>
		<? $year = $schedYear ?>
		<big><b>
			<br/>
			<?=$this->html->link($year,
				'toggle_year',
				array(
					'onclick' => "$$('.year{$year}').each(function(e) {e.toggle()});return false",
				)
			)?>
		</b></big>
		</td>
		<td></td>
	</tr>
	<tr class='year<?=$year?>' <?= $thisYear != $year ? "style='display:none'" : ''?>>
		<td>
	<? } ?>
	<? foreach(array('right'=>'','down'=>'none') as $direction => $display) { ?>

		<?=$this->html->image("arrow_{$direction}.png",array(
			'style'=>"cursor:pointer;width:9px;height:9px;display:{$display}",
			'onclick'=>"swap('s{$id}right','s{$id}down');$('s{$id}list').toggle()",
			'id' => "s{$id}{$direction}"
		))?>
	<? } ?>
	<? $url = $baseUrl ?>
	<? $url['controller'] = 'scheduleGroups' ?>
	<? $url[] = $sched['ScheduleGroup']['id'] ?>
	<?=$this->html->link($sched['ScheduleGroup']['name'],
		$url,
		array(
			'onclick' => 'wait()',
			'onmouseover' => "$('s{$id}list').down('a').style.backgroundColor='#FFF8BA'",
			'onmouseout' => "$('s{$id}list').down('a').style.backgroundColor=''"
		)
	)?><br>
		<div id="s<?=$id?>list" style='margin-left:2em;display:none'>
			<? foreach($sched['Schedule'] as $published) { ?>
				<? $url = $baseUrl ?>
				<? $url[] = $published['id'] ?>
				<?=$this->html->link(
					$time->format('F jS, Y g:ia',$published['updated']),
					$url,
					array('onclick' => 'wait()')
				)?><br>
			<? } ?>
		</div>
		<? if ($id + 1 == count($schedules) && $thisYear != $year) { ?>
			</div>
		<? } ?>
		</td>
		<td valign='top' style='text-align:right'>
		<span title='<?=$schedule->displayEffective($sched['ScheduleGroup'], 'withTimes')?>'><?=$schedule->displayEffective($sched['ScheduleGroup']);?></span>
		<br>
		</td>
	</tr>
<? } ?>
</table>
</div>
