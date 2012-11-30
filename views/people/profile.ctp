<?
$isPersonnel = in_array(
	'personnel',
	Set::combine(Authsome::get('Role'),'{n}.id','{n}.name')
);
$isOperations = in_array(
	'operations',
	Set::combine(Authsome::get('Role'),'{n}.id','{n}.name')
);
?>
<? $P = $person['Person']; ?>
<? $this->set('title_for_layout', $P['first']."'s Profile"); ?>
<?=$html->css("profile") ?>
<?=$this->element('menu');?>
<div class='profile_content'>
<div class='info'>
<?
  $image = $P['img'] ? $P['img'] : 0;
if ($isOperations) {
  echo $this->element('upload_photo', array('id' => $P['id']));
  echo "<div id='remove_photo' style='"?><?=$image? '':'display:none'?><?="'>";
  echo $this->Html->link('Remove Photo',
    array('action'=>'remove_photo',$P['id']),
    array('confirm' => 'Are you sure you want to remove the photo?')
  );
  echo "</div>";
}
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
<div>
  In Residence:<br/>
  <? foreach($times_here as $time_here) { ?>
    <?$start = date('m/d/Y', strtotime($time_here['start']))?>
    <?$end = strtotime($time_here['end']) > time() ? "Present" : date('m/d/Y', strtotime($time_here['end']))?>
    <?="{$start} - {$end}"?><br/>
  <? } ?>
</div>

<? if (Authsome::get('role') == 'operations') { ?>
<? } ?>
</div>
<?=$this->element('dialog');?>
