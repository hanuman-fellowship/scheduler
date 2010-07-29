<? $this->set('title_for_layout', $person['Person']['name']."'s Schedule"); ?>
<?= (!$this->params['isAjax']) ? $this->element('menu',array('person'=>$person['Person']['id'])): '';?>
<span id='schedule_content' class="RC_<?=$person['PeopleSchedules']['resident_category_id']?>">
<?=$this->element('schedule_content');?>
</span>
<?=$this->element('dialog');?>
