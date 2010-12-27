<?
$isPersonnel = in_array(
	'personnel',
	Set::combine(Authsome::get('Role'),'{n}.id','{n}.name')
);
$isOperations = in_array(
	'operations',
	Set::combine(Authsome::get('Role'),'{n}.id','{n}.name')
);
$editable = $this->Session->read('Schedule.editable');
$groupName = $this->session->read('Schedule.Group.name');
?>
<? foreach($people as $category) {
	$categoryData = current($category);
  $categoryName = $categoryData['PeopleSchedules']['ResidentCategory']['name'];
  $categoryId = $categoryData['PeopleSchedules']['ResidentCategory']['id'];
  $categoryColor = $categoryData['PeopleSchedules']['ResidentCategory']['color'];
?>
<div align='center'>
<?= $html->tag('a',$categoryName,array(
	'style' => "font-weight:bold;font-size: 14pt",
	'onmouseout' => 'document.body.style.cursor="default"',
	'onmouseover' => 'document.body.style.cursor="pointer"',
	'onclick' => "$('category_{$categoryId}').toggle()",
	'title' => 'Hide/Show'
));?>
</div>
<table align='center' id="category_<?=$categoryId?>" border="2" cellpadding="5" cellspacing="5" width="1000px">
	<tr>
		<td bordercolor="#000000" align="center"><strong>Name</strong></td>
		<td bordercolor="#000000" align="center"><strong>Hours</strong></td>
<? foreach ($bounds['days'] as $day) { ?>
		<td bordercolor="#000000" align="center"><strong><?=$day?></strong></td>
<? } ?>
		<td bordercolor="#000000" align="center"><strong>Other</strong></td>
	</tr> 
<? foreach($category as $person) { ?>
	<tr>
		<td align='center'><?=$this->html->link($person['Person']['name'],
			array(
				'action'=>'schedule',
				$person['Person']['id']
			),
			array(
				'style' => "color:".$person['PeopleSchedules']['ResidentCategory']['color'],
				'title' => "View {$person['Person']['name']}'s Schedule"
			)) ?></td>
		<td align='center' id="total_hours_<?=$person['Person']['id']?>"></td>
	<? foreach($bounds['days'] as $day_id => $day) { ?>
		<? $off_day = $schedule->offDays($person['OffDay'], $day_id) ?>
		<td <?=$off_day['screen']?>> 
			<div align="center" class="shift"> 
				<p> 
				<?=$off_day['print']?>
		<? foreach ($person['Assignment'] as $assignment) { ?>
			<?=$schedule->displayPersonShift($assignment,array('start'=>'00:00:00','end'=>'24:00:00'),$day_id,true);?>
		<? } ?>		
				</p> 
			</div> 
		</td> 
	<? } ?>
		<td style='font-size:12px'>
			<?$floating = $schedule->displayPersonFloating($person['FloatingShift'],true)?>
			<?$notes = $person['PeopleSchedules']['notes']?>
			<?=$floating?> <?= ($floating && $notes)? '<hr>' : ''?> <i><?=$notes?></i>
		</td>
	</tr>
	<script type="text/javascript">
		$('total_hours_<?=$person['Person']['id']?>').innerHTML = <?=$schedule->total_hours['total'];?>;
	</script>
	<?$schedule->clearHours()?>
<? } ?>
</table>
<br>
<? } ?>
<br><br><br><br><br><br>
