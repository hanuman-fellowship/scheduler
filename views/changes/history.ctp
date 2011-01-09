<fieldset>
	<legend><?php __('Changes');?></legend>
<div class='tall left'>
<? $user = Authsome::get('id')?>
<table width='100%'>
<? foreach($changes as $change) { ?>
	<tr>
		<td style='padding-right:10px'>
	<?=$change['Change']['id'] == 0 ? "<span style='color:green'>&darr;&nbsp;first undo</td><td></td><tr><td>" : ""?>
	<?=$ajax->link($change['Change']['description'],array('action'=>'jump',$change['Change']['id']),array(
		'before' => "wait()",
		'complete' => "window.location.reload()"
	))?>
		</td>
		<td style='color:#888'>
	<?=$time->timeAgoInWords($change['Change']['created'])?>
		</td>
	</tr>
	<?=$change['Change']['id'] == -1 ? "<tr><td><span id='redos' style='color:green'>&uarr;&nbsp;first redo</td<td></td></tr>" : ""?>

<? } ?>
<?=$this->javascript->codeBlock("
	$('redos').scrollIntoView(true);
	setScroll();
");?>
</table>
</fieldset>
<?=$this->element('message');?>
