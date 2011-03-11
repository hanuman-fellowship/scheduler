<?= $ajax->form($this->action,'post',array(
	'model'=>'ResidentCategory',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()'
));?>
	<fieldset>
 		<legend><?php __('Delete Category');?></legend>
	<div class='tall left' id='categories' style='width:300px'>
	<?=$form->input('category_id',array('label'=>false,'type'=>'select','multiple'=>'checkbox','options'=>$categories));?>
	</div>
	<hr/>
	<div class='left'>
	<?=$form->checkbox('check_all',array(
		'onclick' => "checkAll('categories',this)"
	));?>
	<?=$form->label('check_all');?>
	</div>
	</fieldset>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
<?=$this->element('message',array('default_field'=>''));?>
