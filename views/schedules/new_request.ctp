<fieldset>
	<legend><?php __("New {$areaName} Request");?></legend>
	<? if (empty($this->data)) { ?>
	<div class='left'>
	<?= $ajax->form($this->action,'post',array(
		'model'=>'Schedule',
		'update'=>'dialog_content',
		'before'=>"wait()",
		'inputDefaults' => array('between' => '&nbsp;')
	)); ?>
		<?= $form->hidden('area_id',array('value'=>$area_id))?>
		<?= $form->input('name') ?>
		<hr>
		<?=$form->radio('based_on',
			array(
				'published' => 'Published Schedule',
				'template' => 'Template'
			),
			array(
				'separator' => '<br>',
				'value' => 'published'
		))?>
	</div>
	<?=$form->end('Continue');?>
	<? } else { ?>
		Import shifts from:<br>
		<hr>
		<? if (isset($templates)) { ?>
			<div class='tall left'>
			<? foreach($templates as $id => $name) { ?>
				<?=$html->link($name,
					array(
						'controller'=>'schedules',
						'action'=>'addRequest',
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
				'addRequest'=>array(
					'area_id' => $this->data['Schedule']['area_id'],
					'name' => $this->data['Schedule']['name']
				)))?>
		<? } ?>
	<? } ?>
</fieldset>
<?=$this->element('message',array('default_field'=>'ScheduleName'));?>
