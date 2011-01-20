<? if (!isset($people)) { ?>

<fieldset>
	<legend><?php __("Affected People's Schedules");?></legend>
<?= $ajax->form($this->action,'post',array(
	'model'=>'Person',
	'update'=>'dialog_content',
	'before'=>"wait()"
)); ?>
	<?php
		echo $form->input('since',array(
			'id' => 'since',
			'between' => '&nbsp;'
		));
	?>
	(examples: "Yesterday", "10/13/79 6:30am", "6 days ago")<br>
	Leave blank to see all changes
<?php echo $form->end('Submit');?>
</fieldset>
<?=$this->element('message',array('default_field'=>'since'));?>

<? } else { ?>

<?= $form->create('Person',array('action'=>'printm','type'=>'post','onsubmit'=>'wait()'));?>
	<fieldset>
 		<legend><?php __("Affected People's Schedules");?></legend>
	<div class='tall'>

<?
	foreach($people as $category) {
		$categoryData = current($category);
		$categoryName = $categoryData['PeopleSchedules']['ResidentCategory']['name'];
		$categoryId = $categoryData['PeopleSchedules']['ResidentCategory']['id'];
		$categoryColor = $categoryData['PeopleSchedules']['ResidentCategory']['color'];
		$options = Set::combine(array_values($category),'{n}.Person.id','{n}.Person.name');
		foreach($options as $id => $name) {
			if (!in_array($id,array_keys($changed))) {
				unset($options[$id]);
			}
		}
		if ($options) {
?>	
		<div class='left reasons' style='display:none'>
			<strong><?=$categoryName?></strong></span><br/>
		<? foreach($options as $personId => $personName) { ?>
			<span style='color:<?=$categoryColor?>'><?=$personName?></span>
			<div style='padding-left:2em'>
				<? foreach($changed[$personId] as $description) { ?>
					<?=$description?><br>
				<? } ?>
			</div>
		<? } ?>
		</div>
		<div class='left choose' id='people<?=$categoryId; ?>' style='float:left;padding:10px'>
			<span style='position:relative;left:10px;'>
			<strong><?=$categoryName?></strong></span><br/>
<?	
		echo $form->input($categoryId,array(
			'label'    =>  false,
			'type'     => 'select',
			'multiple' => 'checkbox',
			'div'      => array('style' => 'color:'.$categoryColor),
			'options'  => $options
		));
?>	
	<hr/>
	<div class='left'>
	<?=$form->checkbox("all{$categoryId}",array(
		'onclick' => "checkAll('people{$categoryId}',this)"
	));?>
	<label for='PersonAll<?=$categoryId;?>'>All</label>
	</div>
<?
	?></div><?
		}
	}
?>
	</div>
	</fieldset>
	<?=$form->checkbox('show',array(
		'onClick' => "
			$$('.reasons').each(function(e){
				e.toggle();
			});
			$$('.choose').each(function(e){
				e.toggle();
			});
		"
	))?>
	<?=$form->label('show','Show Reasons')?>
	<br>
<?= $form->submit('Print Selected',array('class'=>'choose'));?>
<?= $form->end();?>
<?= $this->element('message');?>

<? } ?>
