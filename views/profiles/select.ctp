<fieldset>
	<legend><?php __('View Profile');?></legend>
<?
debug($profiles);
foreach($profiles as $id => $name) {
	echo $html->link($name,array('action'=>'view',$id),array('onClick'=>'wait()')).'<br/>';
}
?>
</fieldset>
<?=$this->element('message');?>