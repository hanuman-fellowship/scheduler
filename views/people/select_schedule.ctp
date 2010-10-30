<? $last = $session->check('last_person') ?
	$session->read('last_person') : '';
?>
<fieldset>
	<legend><?php __('View Person Schedule');?></legend>
<div class='tall'>
<?
foreach($people as $category) {
	$categoryData = current($category);
	$categoryName = $categoryData['PeopleSchedules']['ResidentCategory']['name'];
	$categoryId = $categoryData['PeopleSchedules']['ResidentCategory']['id'];
?>	
	<div class='left' id='people<?=$categoryId; ?>' style='float:left;padding:10px'>
		<strong><?=$categoryName?></strong><br/>
<?	
	$attributes = array(
		'onClick' => 'wait()',
		'class' => 'RC_' . $categoryId
	);
	foreach($category as $person) {
		$last_style = ($last == $person['Person']['id']) ? array('<b><i>','</i></b>') : array('','');
		echo $last_style[0].
		$html->link(
			$person['Person']['name'],
			array('action'=>'schedule',$person['Person']['id']),
			$attributes
		) . $last_style[1].'<br>';
	}
?>
	</div>
<?
}
?>
</div>
</fieldset>
<?=$this->element('message');?>
