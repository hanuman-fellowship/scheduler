<? $this->set('title_for_layout', $area['RequestArea']['name']." Request"); ?>
<?=$this->element('menu',array('area'=>$area['RequestArea']['id']));?>
<?=$this->element('schedule_message');?>
<?=$this->element('schedule_content');?>
<?=$this->element('dialog');?>
