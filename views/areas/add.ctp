<div class="areas form">
<?= $ajax->form($this->action,'post',array('model'=>'Area','update'=>'dialog_content'));?>
	<fieldset>
 		<legend><?php __('New Area');?></legend>
	<?php
		echo $form->input('name',array(
			'between' => '&nbsp;',
			'id' => 'name'
		));
		echo $form->input('short_name',array(
			'between' => '&nbsp;',
			'id' => 'short_name'
		));
		echo $form->input('manager',array(
			'between' => '&nbsp;',
			'id' => 'manager'
		));
	?>
<?=$this->element('validate',array('default_field'=>'name'));?>
	</fieldset>
<?=$form->end('Submit');?>
</div>
