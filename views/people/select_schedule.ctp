<? $last = $session->check('last_person') ?
	$session->read('last_person') : '';
?>
<fieldset>
	<legend><?php __('View Person Schedule');?></legend>
<div class='tall'>
<table>
<tr>
<?
foreach($people as $category) {
	$categoryData = current($category);
	$categoryName = $categoryData['PeopleSchedules']['ResidentCategory']['name'];
	$categoryId = $categoryData['PeopleSchedules']['ResidentCategory']['id'];
	$categoryColor = $categoryData['PeopleSchedules']['ResidentCategory']['color'];
?>	
	<td valign='top' class='left' id='people<?=$categoryId; ?>' style='padding:10px'>
		<strong><?=$categoryName?></strong><br/>
<?	
	foreach($category as $person) {
		$last_selected = ($last == $person['Person']['id']) ? 'selected' : '';
		echo $html->link(
			$person['Person']['name'],
			array('action'=>'schedule',$person['Person']['id']),
			array(
				'onClick' => 'wait()',
				'style' => 'color:' . $categoryColor,
				'class' => $last_selected
			)
		) . '<br>';
	}
?>
	</td>
<?
}
?>
</tr>
</table>
</div>
</fieldset>
<?= isset($this->params['requested'])? '' : $this->element('message')?>
