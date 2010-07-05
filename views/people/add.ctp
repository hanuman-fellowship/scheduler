<div class="people form">
<?= $ajax->form($this->action,'post',array('model'=>'Person','update'=>'dialog_content'));?>
	<fieldset>
 		<legend><?php __('Add Person');?></legend>
	<?php
		echo $form->input('name',array(
			'between' => '&nbsp;',
			'id' => 'name'
		));
		echo $form->input('resident_category_id',array(
			'between' => '&nbsp;',
			'id' => 'name'
		));
		echo '<br>';
		echo $form->radio('edit_profile',
			array(
				true => 'Yes',
				false => 'No'
			),
			array(
				'value' => (isset($this->data)) ? $this->data['Person']['edit_profile'] : false,
				'separator' => '&nbsp;'
			)
		);
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<?=$this->element('validate',array('default_field'=>'name'));?>
