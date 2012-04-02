<fieldset>
	<legend><?php __('Notes From Operations');?></legend>
<? foreach($notes as $area => $note) { ?>
	<fieldset style='text-align:left'>
		<legend><b>For <?=$area?></b></legend>
		<?=$note? $note : '<i style="color:#999">No notes for you here!</i>'?>
	</fieldset>
<? } ?>
</fieldset>
<?=$this->element('message');?>

