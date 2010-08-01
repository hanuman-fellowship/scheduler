<div class="people form">
<?= $ajax->form($this->action,'post',array('model'=>'Person','update'=>'dialog_content'));?>
	<fieldset>
 		<legend><?php __('Add Person');?></legend>
	<?php
		echo $form->input('first',array(
			'between' => '&nbsp;',
			'id' => 'first'
		));
		echo $form->input('last',array(
			'between' => '&nbsp;',
			'id' => 'last'
		));
		echo $form->select('resident_category_id',$resident_category,null,array('empty'=>false));
	?>
<?=$this->element('validate',array('default_field'=>'first'));?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
