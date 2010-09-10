<?= $ajax->form($this->action,'post',array('model'=>'RequestShift','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
	<fieldset>
 		<legend><?php __('New Shift');?></legend>
	<?php
		echo $form->hidden('request_area_id', array(
			'value' => $request_area_id,
		));
		echo $form->input('day_id', array(
			'default' => $day_id,
			'between' => '&nbsp;'
		));
		echo $form->input('start', array(
			'interval' => 15,
			'selected' => $start,
			'between' => '&nbsp;'
		));
		echo $form->input('end', array(
			'interval' => 15,
			'selected' => $end,
			'between' => '&nbsp;'
		));
		echo $form->input('num_people', array(
			'size' => 1,
			'label' => '# of People',
			'default' => 1,
			'between' => '&nbsp;'
		));
	?>
	</fieldset>
<?= $form->submit('Submit');?>
<?php echo $form->end();?>
<?=$this->element('message',array('default_field'=>'name'));?>
