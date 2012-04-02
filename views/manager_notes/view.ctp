<fieldset>
	<legend><?php __('Notes From Operations');?></legend>
<? foreach($notes as $area => $note) { ?>
	<span class='note-heading'>For <?=$area?></span><hr>
	<?=$note?><hr>
<? } ?>
</fieldset>
<?=$this->element('message');?>

