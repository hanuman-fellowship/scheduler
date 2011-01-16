<fieldset>
	<legend><?php __('Merge Successful');?></legend>
<div class='left'>New Changes:</div><hr>
<div class='tall left'>
<? foreach($descriptions as $description) { ?>
	<?=$description?><br>
<? } ?>
</div>
</fieldset>
<span id='reload_on_close'></span>
<?=$this->element('message')?>
