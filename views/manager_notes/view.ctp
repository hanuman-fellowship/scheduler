<fieldset>
	<legend><?php __('Notes From Operations');?></legend>
<? foreach($notes as $area => $note) { ?>
	<fieldset style='text-align:left'>
		<legend>For <?=$area?></legend>
		<?=$note?>
	</fieldset>
<? } ?>
</fieldset>
<?=$this->element('message');?>

