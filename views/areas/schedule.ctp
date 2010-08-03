<? $this->pageTitle=$area['Area']['name']." Schedule"; ?>
<div style='float:left'>
	<?=$this->element('menu',array('area'=>$area['Area']['id']));?>
</div>
<div style='float:left'>
	<?=$this->element('schedule_message');?>
</div>
<div style='clear:both' id='schedule_content'>
<?=$this->element('schedule_content');?>
</div>
<?=$this->element('dialog');?>
