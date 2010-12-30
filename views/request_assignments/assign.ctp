<fieldset>
	<legend><?php __('Assign Person');?></legend>
<?
$lists = array('available','all');
foreach($lists as $list) {
?><div class='tall' style='clear:both'><?
?><table id='<?=$list?>' <? if($list == 'all') { ?>style='display:none'<?}?>>
<tr>
<?
foreach($people as $category) {
	$categoryData = current($category);
	$categoryName = $categoryData['ResidentCategory']['name'];
	$categoryId = $categoryData['ResidentCategory']['id'];
	$categoryColor = $categoryData['ResidentCategory']['color'];
?>	
	<td valign='top' class='left' id='people<?=$categoryId; ?>' style='padding:10px'>
		<strong><?=$categoryName?></strong><br/>
<?	
	foreach($category as $person) {
		if ($person['available'] === -1) {continue;} // already on this shift so don't ever show.
		if ($person['available'] || $list == 'all') {
			echo $html->link($person['Person']['name'],array($shift,$person['Person']['id']),array(
				'style' => 'color:' . $person['ResidentCategory']['color'],
				'onclick'=>'wait();saveScroll()'
			)) . '<br>';
		}
	}
	echo '</td>';
}
?></tr><?
}
?>
	</table>
</div>
	<div style="clear:both">
		<?=$form->create('RequestAssignment',array('type'=>'post','onSubmit'=>'wait()'));?>
		Other: <?=$form->text('other',array('id' => 'other'));?>
		<?=$form->hidden('shift',array('value'=>$shift));?>
		<?=$form->end();?>
	</div>
</fieldset>
<?=$this->element('message',array('default_field'=>'other'));?>
