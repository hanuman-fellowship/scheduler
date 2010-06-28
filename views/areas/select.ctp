<fieldset>
	<legend><?php __('View Area Schedule');?></legend>
<?
foreach($areas as $id => $name) {
	echo $html->link($name,array('action'=>'schedule',$id)).'<br/>';
}
?>
</fieldset>