<? if (isset($print)) { ?>
	<div style='page-break-after:always'>
<? } else { ?>
	<?=$this->element('menu',array('area'=>$area['Area']['id']));?>
	<div>
<? } ?>
<?= !isset($print) ? $this->element('schedule_message') : '';?>
<? 
	echo $this->element('schedule_content');
	$this->set('title_for_layout', $area['Area']['name']." Schedule");
?>
</div>
<?= !isset($print) ? $this->element('dialog') : '';?>
