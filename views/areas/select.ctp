<? $last = $session->check('last_area') ?
	$session->read('last_area') : '';
?>
<fieldset>
	<legend><?php __('View Area Schedule');?></legend>
<?
echo "<div class='tall left'>";
foreach($areas as $id => $name) {
	$last_style = ($last == $id) ? array('<b><i>','</i></b>') : array('','');
	echo $last_style[0].
	$html->link($name,array('action'=>'schedule',$id),array('onclick'=>'wait()')).
	$last_style[1].'<br/>';
}
echo "</div>";
?>
</fieldset>
<?=$this->element('message');?>
