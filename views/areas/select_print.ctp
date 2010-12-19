<?= $form->create('Area',array('type'=>'post','onsubmit'=>'wait()'));?>
	<fieldset>
 		<legend><?php __('Print Area Schedules');?></legend>
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
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
<?=$this->element('message',array('default_field'=>''));?>
