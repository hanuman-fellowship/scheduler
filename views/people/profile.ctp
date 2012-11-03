<? $P = $person['Person']; ?>
<? $this->set('title_for_layout', $P['first']."'s Profile"); ?>
<?=$html->css("profile") ?>
<?=$this->element('menu');?>
<div class='profile_content'>
<div class='info'>
<?
  echo $this->element('upload_image');
  $image = $P['img'] ? $P['img'] : 0;
  echo "<div id='remove_image' style='display:none'>" . $this->Html->link('Remove Image', '') . "</div>";
  echo $this->Html->image('people/'.$image, array(
    'id' => 'uploaded_img',
    'style' => !$image? 'display:none' : ''
  ));
  echo $this->Html->image('no-photo.png', array(
    'id' => 'no_image',
    'style' => $image? 'display:none' : ''
  ));
?>
<div>
<?= "{$P['first']} {$P['last']}<br/>".
	"{$person['PeopleSchedules']['ResidentCategory']['name']}"; ?>
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
