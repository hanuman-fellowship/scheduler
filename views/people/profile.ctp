<? $P = $person['Person']; ?>
<? $this->set('title_for_layout', $P['first']."'s Profile"); ?>
<?=$html->css("profile") ?>
<?=$this->element('menu');?>
<div class='profile_content'>
<div class='info'>
<?= $html->image("photos/profile/{$image}",array(
	'class' => 'profile_image'
));?>
<div>
<?= "{$P['first']} {$P['middle']} {$P['last']}<br/>".
	"{$person['PeopleSchedules']['ResidentCategory']['name']}"; ?>
</div>

<div>
<?= "Housing: {$P['housing']}"; ?>
</div>

</div>
<? if (Authsome::get('role') == 'operations') { ?>
<div class='upload_image'>
	<?= $ajax->link('Upload Image',array('action'=>'uploadImage',$P['id']),array(
		'update' => 'dialog_content',
		'complete' => "openDialog('upload','true')",
		'id' => 'upload',
	)); ?>
</div>
<? } ?>
</div>
<?=$this->element('dialog');?>
