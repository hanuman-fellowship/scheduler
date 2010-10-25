<? $group = isset($this->data['Schedule']['group']) ? $this->data['Schedule']['group'] : 'update';?>
<fieldset>
	<legend><?php __("Publish Schedule <i>{$scheduleName}</i>");?></legend>
<?= $ajax->form($this->action,'post',array(
	'model'=>'Schedule',
	'update'=>'dialog_content',
	'before'=>"wait()"
)); ?>
		<div class='left'>
		<?=$form->radio(
			'group',
			array(
				'update' => "Update \"{$this->Session->read('Schedule.Group.name')}\"",
				'new' => 'New Schedule'
			),
			array(
				'separator' => '<br/>',
				'value' => $group,
				'onchange' => "toggleDisplay('nameDiv')",
				'legend' => false
			)
		);?>
		</div>
		<div style='display:<?= $group == 'update' ? 'none' : ''?>' id='nameDiv'>
		<?=$form->input('name',array(
			'id' => 'name',
			'between' => '&nbsp;'
		)); ?>
		<?=$form->input('start',array(
			'id' => 'start',
			'between' => '&nbsp;'
		));?>
		<?=$form->input('end',array(
			'id' => 'end',
			'between' => '&nbsp;'
		));?>
		</div>
<?php echo $form->end('Submit');?>
</fieldset>
<?=$this->element('message',array('default_field'=>'name'));?>
