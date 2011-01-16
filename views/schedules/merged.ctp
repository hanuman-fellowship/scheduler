<fieldset>
	<legend><?php __('Merge Successful');?></legend>
<div class='tall left'>
<br><b>New Changes:</b><br><br>
<? foreach($descriptions as $description) { ?>
	<?=$description?><br>
<? } ?>
</div>
</fieldset>
<span id='reload_on_close'></span>
<?=$this->element('message')?>
