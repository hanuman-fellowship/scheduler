<? $last = $session->check('last_area') ?
	$session->read('last_area') : '';
?>
<fieldset>
	<legend><?php __('View Area Schedule');?></legend>
<?
echo "<div class='tall left'>";
foreach($areas as $id => $name) {
	$last_style = ($last == $id) ? 'font-weight:bold;font-style:italic' : '';
	echo $html->link($name,array('action'=>'schedule',$id),array(
		'onclick'=>'wait()',
		'style' => $last_style
	)).
	'<br/>';
}
echo "</div>";
?>
</fieldset>
<?=$this->element('message');?>
