<? $this->pageTitle=$person['Person']['name']."'s Profile"; ?>
<?=$this->element('menu');?>
<?= $html->image("photos/profile/{$image}");?>
<? if (Authsome::get('role') == 'operations') { ?>
	<?= $ajax->link('Upload Image',array('action'=>'uploadImage',$id,$schedule_id),array(
		'update' => 'dialog_content',
		'complete' => "openDialog('upload','true')",
		'id' => 'upload'
	)); ?>
<? } ?>
<?=$this->element('dialog');?>
