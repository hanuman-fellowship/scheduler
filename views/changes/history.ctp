<fieldset>
	<legend><?php __('History');?></legend>
<div class='tall left'>
<?
$user = Authsome::get('id');
echo '<div style="color:#CCCCCC">';
foreach($changes as $change) {
	echo $ajax->link($change['Change']['description'],array('action'=>'jump',$change['Change']['id']),array(
		'before' => "wait()",
		'complete' => "window.location.reload()"
	));
	echo $change['Change']['id'] == 0 ? "<span id='current'></span><br>" : "<br>";
}
?>
<?=$this->javascript->codeBlock("
	$('current').scrollIntoView(true);
	$('current').style.color = 'black';
	$('current').style.fontWeight = 'bold';
	$('current').innerHTML = '&nbsp;&nbsp;<---- last change';
	setScroll();
");?>
</div>
</fieldset>
<?=$this->element('message');?>
