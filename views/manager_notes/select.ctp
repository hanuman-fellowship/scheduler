<fieldset style='text-align:left'>
	<legend><?php __('Edit Notes from Operations to:');?></legend>
<hr>
<?=$this->html->link('All Areas', array(0))?><hr>
<? foreach($areas as $id => $area) { ?>
	<?=$this->html->link($area, array($id))?><br>
<? } ?>
</fieldset>
<?=$this->element('message');?>
