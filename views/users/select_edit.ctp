<? $cur = Authsome::get('id');?>
<fieldset>
	<legend><?php __('Edit User');?></legend>
<?
echo "<div class='tall left'>";
foreach($users as $id => $name) {
	$cur_style = ($cur == $id) ? array('<b><i>','</i></b>') : array('','');
	echo $cur_style[0].
	$ajax->link($name,array($id),array(
		'before'=>'wait()',
		'update' => 'dialog_content'
	)).
	$cur_style[1].'<br/>';
}
echo "</div>";
?>
</fieldset>
<?=$this->element('message');?>
