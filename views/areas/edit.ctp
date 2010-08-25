<?= $ajax->form($this->action,'post',array('model'=>'Area','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
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
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>
