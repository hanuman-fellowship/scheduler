<div class="areas form">
<?= $ajax->form($this->action,'post',array('model'=>'Area','update'=>'dialog_content','before'=>'saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Edit Area');?></legend>
	<?php
		echo $form->hidden('id');
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
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<?=$this->element('validate',array('default_field'=>'name'));?>
