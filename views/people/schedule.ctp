<? $this->set('title_for_layout', $person['Person']['name']."'s Schedule"); ?>
<? if (isset($print)) { ?>
	<div style='page-break-after:always'>
<? } else { ?>
	<?=$this->element('menu',array('person'=>$person['Person']['id']));?>
	<div>
<? } ?>
<?= !isset($print) ? $this->element('schedule_message') : '';?>
<?=$this->element('schedule_content');?>
</div>
<?= !isset($print) ? $this->element('dialog') : '';?>
