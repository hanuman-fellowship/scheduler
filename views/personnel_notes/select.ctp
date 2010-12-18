<? $last = $session->check('last_person') ?
	$session->read('last_person') : '';
?>
<fieldset>
	<legend><?php __('Edit Personnel Notes');?></legend>
<div class='tall'>
<?
foreach($people as $category) {
	$categoryData = current($category);
	$categoryName = $categoryData['PeopleSchedules']['ResidentCategory']['name'];
	$categoryId = $categoryData['PeopleSchedules']['ResidentCategory']['id'];
	$categoryColor = $categoryData['PeopleSchedules']['ResidentCategory']['color'];
?>	
	<div class='left' id='people<?=$categoryId; ?>' style='float:left;padding:10px'>
		<strong><?=$categoryName?></strong><br/>
<?	
	foreach($category as $person) {
		$last_style = ($last == $person['Person']['id']) ? 'font-weight:bold;font-style:italic' : '';
		echo $ajax->link(
			$person['Person']['name'],
			array('action'=>'edit',$person['Person']['id']),
			array(
				'before' => 'wait()',
				'style' => $last_style . ';color:' . $categoryColor,
				'update' => 'dialog_content',
				'complete' => "openDialog('dialog',true)"
			)
		) . '<br>';
	}
?>
	</div>
<?
}
?>
</div>
</fieldset>
<?=$this->element('message');?>
