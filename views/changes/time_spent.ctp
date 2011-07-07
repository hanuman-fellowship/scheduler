<? $this->log($times) ?>
<fieldset>
	<legend><?php __('Time Spent');?></legend>
	<table width='400px' style='text-align:left'>
		<tr>
			<td><b>Date</b></td>
			<td><b>Start</b></td>
			<td><b>End</b></td>
			<td><b>Time</b></td>
			<? foreach($times as $key => $cur_time) { ?>
				<tr>
					<? if ($key === 'total') { ?>
							<td colspan='4'><hr></td>
						</tr>
						<tr>
							<td></td>
							<td></td>
							<td><b>Total:</b></td>
							<td><?=$cur_time?></td>
					<? } else { ?>
						<td><?=date('D, M jS, Y', strtotime($cur_time['start']))?></td>
						<td><?=date('g:ia', strtotime($cur_time['start']))?></td>
						<td><?=date('g:ia', strtotime($cur_time['end']))?></td>
						<td><?=$cur_time['time']?></td>
					<? } ?>
				</tr>
			<? } ?>
		</tr>
	</table>
</fieldset>
<?=$this->element('message');?>
