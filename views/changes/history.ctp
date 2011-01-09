<fieldset>
	<legend><?php __('Changes');?></legend>
<div class='tall left'>
<? $user = Authsome::get('id')?>
<table width='100%'>
<? foreach($changes as $change) { ?>
	<tr>
		<td style='padding-right:10px'>
	<?=$change['Change']['id'] == 0 ? "<span style='color:green'>&darr;&nbsp;first undo</td><td></td><tr><td>" : ""?>
	<?=$change['Change']['description']?>
		</td>
		<td style='color:#888'>
	<?=$time->timeAgoInWords($change['Change']['created'])?>
		</td>
	</tr>
	<?=$change['Change']['id'] == -1 ? "<tr><td><span id='redos' style='color:green'>&uarr;&nbsp;first redo</td<td></td></tr>" : ""?>

<? } ?>
<?=$this->javascript->codeBlock("
	$('redos').up('tr').previous('tr').scrollIntoView(true);
	setScroll();
");?>
</table>
</fieldset>
<?=$this->element('message');?>
