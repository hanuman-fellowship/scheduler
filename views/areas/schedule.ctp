<? $this->set('title_for_layout', $area['Area']['name']." Schedule"); ?>
<?=$this->element('menu',array('area'=>$area['Area']['id']));?>
<?=$this->element('schedule_message');?>
<?=$this->element('schedule_content');?>
<?=$this->element('dialog');?>
