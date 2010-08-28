<? $this->set('title_for_layout', $person['Person']['name']."'s Schedule"); ?>
<?=$this->element('menu',array('person'=>$person['Person']['id']));?>
<?=$this->element('schedule_message');?>
<?=$this->element('schedule_content');?>
<?=$this->element('dialog');?>
