<fieldset>
	<legend><?php __('Edit Request');?></legend>
<?
foreach($requests as $id => $name) {
	echo $html->link($name,array($id));
	echo '<br/>';
}
?>
</fieldset>
<?=$this->element('message');?>
