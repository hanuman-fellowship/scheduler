<? if (isset($requests)) { ?>
	<fieldset>
		<legend><?php __('View Requests');?></legend>
	<?=$this->element('submitted')?>
</fieldset>
<? } else { ?>
	<?=$this->element('schedule_content',array('request'=>true))?>
<? } ?>
<?=$this->element('message');?>
