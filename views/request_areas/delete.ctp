<?
$used = array();
foreach($areas as $id => $area) {
	if (!in_array(abs($id),$used)) unset($areas[$id*-1]);
	$used[] = abs($id);
}
?>
<?= $ajax->form($this->action,'post',array(
	'model'=>'RequestArea',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()'
));?>
	<fieldset>
 		<legend><?php __('Clear Request Forms');?></legend>
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
<?=$this->element('message');?>
