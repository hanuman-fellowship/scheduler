<fieldset>
	<legend><?php __('Changes');?></legend>
<div class='tall left'>
<?
$user = Authsome::get('id');
echo '<div style="color:#CCCCCC">';
foreach($changes as $change) {
	echo $change['Change']['id'] == 0 ? "<span style='color:green'>&darr;&nbsp;first undo<br>" : "<br>";
	echo $ajax->link($change['Change']['description'],array('action'=>'jump',$change['Change']['id']),array(
		'before' => "wait()",
		'complete' => "window.location.reload()"
	));
	echo $change['Change']['id'] == -1 ? "<br><span id='redos' style='color:green'>&uarr;&nbsp;first redo<br>" : "";

}
?>
<?=$this->javascript->codeBlock("
	$('redos').scrollIntoView(true);
	setScroll();
");?>
</div>
</fieldset>
<?=$this->element('message');?>
