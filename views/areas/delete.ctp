<? $last = $session->check('last_area') ?
	$session->read('last_area') : '';
?>
<fieldset>
	<legend><?php __('Delete Area');?></legend>
<div class='tall left'>
<?
foreach($areas as $id => $name) {
	$last_style = ($last == $id) ? array('<i>','</i>') : array('','');
	echo $last_style[0].
		$html->link($name,array($id),array(
			'class' => 'remove'
		)).'<br/>'.
		$last_style[1];
}
?>
</div>
</fieldset>
