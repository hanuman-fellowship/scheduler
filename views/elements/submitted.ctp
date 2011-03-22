<? if (isset($newRequest)) { ?>
	<? $baseUrl = array(
		'controller' => 'schedules',
		'action' => 'newRequest',
		$newRequest['area_id'],
		$newRequest['name']
	) ?>
	<? $type = 'html' ?>
<? } else { ?>
	<? $baseUrl = array(
		'controller' => 'schedules',
		'action' => 'viewRequest'
	) ?>
	<? $type = 'ajax' ?>
<? } ?>
<div class='tall left' style='width:30em'>
<?  $root = $this->html->url('/'); ?>
<table width='100%'>
<?  foreach($requests as $area_id => $schedules) { ?>
	<tr>
		<td>
	<? foreach(array('right'=>'','down'=>'none') as $direction => $display) { ?>
		<?=$this->html->image("arrow_{$direction}.png",array(
			'style'=>"cursor:pointer;width:9px;height:9px;display:{$display}",
			'onclick'=>"swap('s{$area_id}right','s{$area_id}down');$('s{$area_id}list').toggle()",
			'id' => "s{$area_id}{$direction}"
		))?>
	<? } ?>
	<? $first_schedule = reset($schedules) ?>
	<? $area_name = $first_schedule['Area']['name'] ?>
	<? $url = $baseUrl ?>
	<? $url[] = $first_schedule['Schedule']['id'] ?>
	<?=$this->{$type}->link($area_name,
		$url,
		array(
			'before' => 'wait()',
			'onmouseover' => "$('s{$area_id}list').down('a').style.backgroundColor='#FFF8BA'",
			'onmouseout' => "$('s{$area_id}list').down('a').style.backgroundColor=''",
			'update' => 'dialog_content',
			'complete' => "openDialog('content',true,'bottom',true)"
		)
	)?>
	<? $num = count($schedules) ?>
	<?= ($num > 1) ? "<b>({$num})</b>" : ''?> <br>
		<div id="s<?=$area_id?>list" style='margin-left:2em;display:none'>
			<? foreach($schedules as $request) { ?>
				<table width="100%">
				<tr>
				<td align='left'>
				<? $url = $baseUrl ?>
				<? $url[] = $request['Schedule']['id'] ?>
				<?=$this->{$type}->link($request['Schedule']['name'],
					$url,
					array(
						'before' => 'wait()',
						'update' => 'dialog_content',
						'complete' => "openDialog('content',true,'bottom',true)"
					)
				)?>
				</td>
				<td align='right'>
				<?= $time->format('F jS, Y g:ia',$request['Schedule']['updated']) ?>
			</td>
			</tr>
			</table>
			<? } ?>
		</div>
		</td>
		<td valign='top' style='text-align:right'>
		</td>
	</tr>
<? } ?>
</table>
</div>
