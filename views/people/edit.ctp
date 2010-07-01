<div class="people form">
<?= $ajax->form($this->action,'post',array('model'=>'Person','update'=>'dialog_content'));?>
	<fieldset>
 		<legend><?php __('Edit Person');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('name',array(
			'between' => '&nbsp',
			'id' => 'name'
		));
		echo $form->input('resident_category_id',array(
			'between' => '&nbsp',
			'id' => 'name'
		));
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<?=$this->element('validate',array('default_field'=>'name'));?>
