<?= $ajax->form($this->action,'post',array('model'=>'Person','update'=>'dialog_content','before'=>'wait()'));?>
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
		echo $form->select('resident_category_id',$residentCategory,null,array('empty'=>false));
	?>
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'first'));?>