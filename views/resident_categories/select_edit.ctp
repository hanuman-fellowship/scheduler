<fieldset>
	<legend><?php __('Edit Category');?></legend>
<?
echo "<div class='tall left'>";
foreach($categories as $id => $name) {
	echo $ajax->link($name,array($id),array(
		'before'=>'wait()',
		'update' => 'dialog_content'
	))."<br>";
}
echo "</div>";
?>
</fieldset>
<?=$this->element('message');?>

