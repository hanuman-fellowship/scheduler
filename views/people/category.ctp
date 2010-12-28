<?= $ajax->form($this->action,'post',array(
	'model'=>'PeopleSchedules',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('Change Category');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->select('resident_category_id',$residentCategory,
			$this->data['PeopleSchedules']['resident_category_id'],array('empty'=>false));
	?>
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'first'));?>
<?
?>
