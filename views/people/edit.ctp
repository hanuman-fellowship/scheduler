<?= $ajax->form($this->action,'post',array('model'=>'Person','update'=>'dialog_content','before'=>'saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Edit Person');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('first',array(
			'between' => '&nbsp;',
			'id' => 'first'
		));
		echo $form->input('last',array(
			'between' => '&nbsp;',
			'id' => 'last'
		));
		echo $form->select('resident_category_id',$residentCategory,
			$this->data['Person']['resident_category_id'],array('empty'=>false));
	?>
<?=$this->element('validate',array('default_field'=>'first'));?>
	</fieldset>
<?php echo $form->end('Submit');?>
