<?= $ajax->form($this->action,'post',array(
	'model'=>'Person',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('Edit Person');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('first',array('id' => 'first'));
		echo $form->input('last',array('id' => 'last'));
		echo $form->input('name',array('id' => 'name','label'=>'Display Name'));
		echo $form->hidden('auto_name',array('value'=>$this->data['Person']['name']));
	?>
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'first'));?>
