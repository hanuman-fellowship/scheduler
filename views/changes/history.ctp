<fieldset>
	<legend><?php __('Changes');?></legend>
<div class='tall left'>
<? $user = Authsome::get('id')?>
<table width='100%'>
<? foreach($changes as $change) { ?>
	<? $desc = $change['Change']['description'] ?>
	<tr>
		<td class='undone<?=$change['Change']['undone']?>' style='padding-right:10px;<?= $change['Change']['undone'] ? 'text-decoration:line-through' : ''?>'>
	<?= (strlen($desc) > 100)? substr($desc,0,97) . '...' : $desc?>
		</td>
		<td style='color:#888'>
	<?=$time->timeAgoInWords($change['Change']['created'])?>
		</td>
	</tr>
<? } ?>
<?=$this->javascript->codeBlock("
	$$('.undone1').last().up('tr').previous('tr',7).scrollIntoView(true);
	setScroll();
");?>
</table>
</fieldset>
<?=$this->element('message');?>
