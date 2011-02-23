<fieldset>
	<legend><?php __('Delete Request');?></legend>
<?
foreach($requests as $id => $name) {
	echo $html->link($name,array($id),array(),"Delete the Request \"{$name}\"?");
	echo '<br/>';
}
?>
</fieldset>
<?=$this->element('message');?>
