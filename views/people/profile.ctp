<? $P = $person['Person']; ?>
<? $this->pageTitle=$P['name']."'s Profile"; ?>
<?=$html->css("profile") ?>
<?=$this->element('menu');?>
<div class='profile_content'>
<div class='info'>
<?= $html->image("photos/profile/{$image}",array(
	'class' => 'profile_image'
));?>
<div>
<?= "{$P['first']} {$P['middle']} {$P['last']}<br/>".
	"({$P['name']}) {$person['ResidentCategory']['name']}"; ?>
</div>

<div>
<?= "Housing: {$P['housing']}"; ?>
</div>

</div>
<? if (Authsome::get('role') == 'operations') { ?>
<div class='upload_image'>
	<?= $ajax->link('Upload Image',array('action'=>'uploadImage',$id,$schedule_id),array(
		'update' => 'dialog_content',
		'complete' => "openDialog('upload','true')",
		'id' => 'upload',
	)); ?>
</div>
<? } ?>
</div>
<?=$this->element('dialog');?>
