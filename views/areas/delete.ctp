<fieldset>
	<legend><?php __('Delete Area');?></legend>
<div class='tall left'>
<?
foreach($areas as $id => $name) {
	echo $html->link($name,array('action'=>'schedule',$id),array(
		'class' => 'remove'
	)).'<br/>';
}
?>
</div>
</fieldset>
