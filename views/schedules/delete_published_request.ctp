<?= $ajax->form($this->action,'post',array(
	'model'=>'Schedule',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()'
));?>
	<fieldset>
 		<legend><?php __('Delete Request');?></legend>
	<div class='tall left' id='requests' style='width:300px'>
	<? foreach($requests as $areaName => $schedules) { ?>
		<fieldset>
			<legend><?php __($areaName);?></legend>
				<?=$form->input($areaName,array('label'=>false,'type'=>'select','multiple'=>'checkbox','options'=>$schedules));?>
		</fieldset>
	<? } ?>
	</div>
	<hr/>
	<div class='left'>
	<?=$form->checkbox('check_all',array(
		'onclick' => "checkAll('requests',this)"
	));?>
	<?=$form->label('check_all');?>
	</div>
	</fieldset>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
<?=$this->element('message',array('default_field'=>''));?>
