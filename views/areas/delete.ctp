<fieldset>
	<legend><?php __('Delete Area');?></legend>
<?
foreach($areas as $id => $name) {
	echo $html->link($name,array('action'=>'schedule',$id),array(
		'class' => 'remove'
	)).'<br/>';
}
?>
</fieldset>
