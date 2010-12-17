<? $cur = Authsome::get('id');?>
<fieldset>
	<legend><?php __('Edit User');?></legend>
<?
echo "<div class='tall left'>";
foreach($users as $id => $name) {
	$cur_style = ($cur == $id) ? "font-weight:bold;font-style:italic" : '';
	echo $ajax->link(Inflector::humanize($name),array($id),array(
		'before'=>'wait()',
		'update' => 'dialog_content',
		'style' => $cur_style
	))."<br>";
}
echo "</div>";
?>
</fieldset>
<?=$this->element('message');?>
