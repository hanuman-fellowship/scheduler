<? if (!isset($areas)) { ?>

<fieldset>
	<legend><?php __("Affected Area's Schedules");?></legend>
<?= $ajax->form($this->action,'post',array(
	'model'=>'Area',
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

<?= $form->create('Area',array('action'=>'printm','type'=>'post','onsubmit'=>'wait()'));?>
	<fieldset>
 		<legend><?php __("Affected Area's Schedules");?></legend>
	<div class='tall left' id='areas' style='width:300px'>
	<?=$form->input('area_id',array('label'=>false,'type'=>'select','multiple'=>'checkbox','options'=>$areas));?>
	</div>
	<hr/>
	<div class='left'>
	<?=$form->checkbox('check_all',array(
		'onclick' => "checkAll('areas',this)"
	));?>
	<?=$form->label('check_all');?>
	</div>
	</fieldset>
<?= $form->submit('Print Selected');?>
<?php echo $form->end();?>
<?=$this->element('message',array('default_field'=>''));?>

<? } ?>
