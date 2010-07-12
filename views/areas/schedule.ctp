<? $this->pageTitle=$area['Area']['name']." Schedule"; ?>
<?=$this->element('menu',array('area'=>$area['Area']['id']));?>
<div id='schedule_content'>
<?=$this->element('schedule_content');?>
</div>
<?=$this->element('dialog');?>
