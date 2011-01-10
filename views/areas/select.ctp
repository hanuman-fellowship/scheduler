<? $last = $session->check('last_area') ?
	$session->read('last_area') : '';
?>
<fieldset>
	<legend><?php __('View Area Schedule');?></legend>
<?
echo "<div class='tall left'>";
foreach($areas as $id => $name) {
	$last_selected = ($last == $id) ? 'selected' : '';
	echo $html->link($name,array('action'=>'schedule',$id),array(
		'onclick'=>'wait()',
		'class' => $last_selected
	)).
	'<br/>';
}
echo "</div>";
?>
</fieldset>
<?=$this->element('message');?>
