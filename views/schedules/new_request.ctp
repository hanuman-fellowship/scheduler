<? if (isset($blank)) { ?>
	<?=$javascript->codeBlock("window.location = '{$html->url('/')}'")?>
	<? die; ?>
<? } ?>
<fieldset>
	<legend><?php __("New {$areaName} Request");?></legend>
	<? if (empty($this->data) || isset($errorMessage)) { ?>
	<div class='left'>
	<?= $ajax->form($this->action,'post',array(
		'model'=>'Schedule',
		'update'=>'dialog_content',
		'before'=>"wait()",
		'inputDefaults' => array('between' => '&nbsp;')
	)); ?>
		<?= $form->hidden('area_id',array('value'=>$area_id))?>
		<?= $form->input('name',array('size'=>'50')) ?>
		<i>(Examples: "January Session", "New Year's Retreat", "Without Michael")</i>
		<hr>
		<?=$form->radio('based_on',
			array(
				'published' => 'Published Schedule',
				'template' => 'Template',
				'blank' => 'Blank'
			),
			array(
				'separator' => '<br>',
				'value' => empty($this->data)? 'published' : $this->data['Schedule']['based_on']
		))?>
	<?=$form->end('Continue');?>
	</div>
	<? } else { ?>
		Import shifts from:<br>
		<hr>
		<? if ($this->data['Schedule']['based_on'] == 'template') { ?>
			<div class='tall left'>
			<? foreach($templates as $id => $name) { ?>
				<?=$html->link($name,
					array(
						'controller'=>'schedules',
						'action'=>'newRequest',
						$area_id,
						$this->data['Schedule']['name'],
						$id
					),
					array('onclick' => 'wait()')
				) ?>
				<br/>
			<? } ?>
			</div>
		<? } else { ?>
			<?=$this->element('published',array(
				'newRequest'=>array(
					'area_id' => $this->data['Schedule']['area_id'],
					'name' => $this->data['Schedule']['name']
				)))?>
		<? } ?>
	<? } ?>
</fieldset>
<?=$this->element('message',array('default_field'=>'ScheduleName'));?>
