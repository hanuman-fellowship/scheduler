<?=$javascript->link('tiny_mce/tiny_mce');?>
<?=$javascript->codeBlock("
    tinyMCE.init({ 
		content_css : '{$this->webroot}css/tiny_mce.css',
		theme : 'advanced', 
		mode : 'textareas', 
		convert_urls : false,
		auto_focus : 'UserNotes'
	}); 
")?>
<? $this->set('title_for_layout', 'Scheduler: Notepad')?>
<?=$this->element('menu');?>
<?=$this->element('schedule_message');?>
<div align='center'>
<span style='font-weight:bold;font-size:24px'><?=Inflector::humanize(Authsome::get('username'))?>'s Notepad</span><br><br>
<?= $form->create('User')?>
<?= $form->input('id')?>
<?= $form->input('notes',array('style'=>'font-size:18px;height:400px;width:600px','label'=>false))?>
<br><br>
<?= $form->submit('Save')?>
<?= $form->end() ?>
</div>
<?=$this->element('dialog');?>
