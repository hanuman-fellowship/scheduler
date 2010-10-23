<fieldset>
	<legend><?php __('Past Schedules');?></legend>
<div class='tall left' style='width:30em'>
<?
// $current_schedule = $session->read('Schedule.id');

// using html->link() for each url is too slow, so here we get
// the root of the url, and build it manually for each link
$root = $this->html->url('/');
?><table width='100%'><?
foreach($schedules as $sched) {
//	$current = $sched['Schedule']['id'] == $current_schedule ? 'current' : '';
	?>
	<tr>
		<td>
	<?="<a id='current' onclick='wait()' href='{$root}schedules/select/{$sched['id']}'>". 
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
