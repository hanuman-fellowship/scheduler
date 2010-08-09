	<fieldset>
 		<legend><?php __('Upload Profile Image');?></legend>
	<?php
		echo $form->create('Person', array('type' => 'file', 'onSubmit'=> 'wait()'));
		echo $form->hidden('id',array('default'=>$id));
		echo $form->file('person', array(
			'between' => '&nbsp;'
		));
	?>
<?=$form->end('Submit');?>
	</fieldset>
<?=$this->element('message');?>
