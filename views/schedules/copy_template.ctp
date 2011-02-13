<fieldset>
	<legend><?php __('New Copy From Template');?></legend>
<?
echo "<div class='tall left'>";
foreach($templates as $id => $name) {
	echo $ajax->link($name,array('action'=>'copy',$id),array(
		'before'=>'wait()',
		'update' => 'dialog_content'
	)).
	'<br/>';
}
echo "</div>";
?>
</fieldset>
<?=$this->element('message');?>
