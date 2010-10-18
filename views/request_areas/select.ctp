<fieldset>
	<legend><?php __('View Area Request');?></legend>
<?
echo "<div class='tall left'>";
foreach($areas as $id => $name) {
	echo $html->link($name,array('action'=>'view',$id),array('onclick'=>'wait()')).'<br/>';
}
echo "</div>";
?>
</fieldset>
<?=$this->element('message');?>
