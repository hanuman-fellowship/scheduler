<?= $ajax->form($this->action,'post',array(
	'model'=>'ResidentCategory',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('Edit Category');?></legend>
	<?php
		echo $form->hidden('id');
		echo $form->input('name',array('id' => 'name'));
	?>
Color&nbsp;<a href="javascript:pickColor('pick1299802156');" id="pick1299802156" style="border: 1px solid #000000; font-family:Verdana; font-size:10px; text-decoration: none;">&nbsp;&nbsp;&nbsp;</a>
<input id="pick1299802156field" value="<?=$this->data['ResidentCategory']['color']?>" size="7" onChange="relateColor('pick1299802156', this.value);" name="data[ResidentCategory][color]">
<?=$javascript->codeBlock("relateColor('pick1299802156', getObj('pick1299802156field').value)")?>
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>
