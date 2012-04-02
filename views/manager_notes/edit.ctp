<?=$javascript->link('tiny_mce/tiny_mce');?>
<?=$javascript->codeBlock("
    tinyMCE.init({ 
		content_css : '{$this->webroot}css/tiny_mce.css',
		theme : 'advanced', 
		mode : 'textareas', 
		convert_urls : false,
		auto_focus : 'ManagerNoteNote'
	}); 
")?>
<? $this->set('title_for_layout', 'Scheduler: Notes to Managers')?>
<?=$this->element('menu');?>
<?=$this->element('schedule_message');?>
<div align='center'>
<span style='font-weight:bold;font-size:24px'>Notes from Operations to<br/>Managers of <?=$area_name?></span><br><br>
<?= $form->create('ManagerNote')?>
<?= $form->hidden('area_id', array('value' => $area_id))?>
<?= $form->input('note',array('style'=>'font-size:18px;height:400px;width:600px','label'=>false))?>
<br><br>
<?= $form->submit('Save')?>
<?= $form->end() ?>
</div>
<?=$this->element('dialog');?>
