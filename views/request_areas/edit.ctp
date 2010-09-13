<? $this->set('title_for_layout', $area['RequestArea']['name']." Request Form"); ?>
<?=$this->element('menu',array('area'=>$area['RequestArea']['id']));?>
<?=$this->element('schedule_message');?>
<?=$this->element('schedule_content');?>
<?=$this->element('dialog');?>
