<? $last = $session->check('last_person') ?
	$session->read('last_person') : '';
?>
<fieldset>
	<legend><?php __('View Person Schedule');?></legend>
<table>
<tr>
<?
foreach($people as $category) {
	$categoryData = current($category);
	$categoryName = $categoryData['PeopleSchedules']['ResidentCategory']['name'];
	$categoryId = $categoryData['PeopleSchedules']['ResidentCategory']['id'];
?>	
	<td class='left' id='people<?=$categoryId; ?>' style='float:left;padding:10px'>
		<strong><?=$categoryName?></strong><br/>
<?	
	foreach($category as $person) {
		$last_style = ($last == $person['Person']['id']) ? 'font-weight:bold;font-style:italic' : '';
		echo $html->link(
			$person['Person']['name'],
			array('action'=>'schedule',$person['Person']['id']),
			array(
				'onClick' => 'wait()',
				'class' => 'RC_' . $categoryId,
				'style' => $last_style
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
</fieldset>
<?=$this->element('message');?>
