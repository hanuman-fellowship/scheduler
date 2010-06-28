<? $this->pageTitle=$person['Person']['name']."'s Schedule"; ?>
<?=$this->element('schedule');?>
<span id='schedule_content' class="RC_<?=$person['Person']['resident_category_id']?>">
<?=$this->element('schedule_content');?>
</span>
<?=$this->element('dialog');?>