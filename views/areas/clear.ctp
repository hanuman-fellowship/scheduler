<?= $ajax->form($this->action,'post',array('model'=>'Area','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Clear Area Schedule');?></legend>
	<?=$form->checkbox('keep_shifts');?>
	<?=$form->label('keep_shifts');?>
	<hr/>
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
