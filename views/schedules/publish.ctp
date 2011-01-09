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
				'update' => "Add to Schedule Group \"{$this->Session->read('Schedule.Group.name')}\"",
				'new' => 'New Schedule Group'
			),
			array(
				'separator' => '<br/>',
				'value' => $group,
				'onchange' => "$('nameDiv').toggle();$('name').select()",
				'legend' => false
			)
		);?>
		</div>
		<div style='display:<?= $group == 'update' ? 'none' : ''?>' id='nameDiv'>
		<?=$form->input('name',array(
			'id' => 'name',
			'between' => '&nbsp;'
		)); ?>
		<p>Effective:</p>
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
