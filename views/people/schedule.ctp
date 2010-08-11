<? $this->set('title_for_layout', $person['Person']['name']."'s Schedule"); ?>
<div style='float:left'>
<?= (!$this->params['isAjax']) ? $this->element('menu',array('person'=>$person['Person']['id'])): '';?>
</div>
<div style='float:left'>
	<?=$this->element('schedule_message');?>
</div>
<div style='clear:both' id='schedule_content'>
<?=$this->element('schedule_content');?>
</div>
<?=$this->element('dialog');?>
