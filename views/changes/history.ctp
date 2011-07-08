<fieldset>
	<legend><?php __('Changes');?></legend>
<div class='tall left'>
<? $user = Authsome::get('id')?>
<table width='100%'>
<? foreach($changes as $change) { ?>
	<? $desc = $change['Change']['description'] ?>
	<tr>
		<td class='undone<?=$change['Change']['undone']?>' style='padding-right:10px;<?= $change['Change']['undone'] ? 'text-decoration:line-through' : ''?>'>
	<?= (strlen($desc) > 100)? $html->tag('span',substr($desc,0,97) . '...',array('title'=>$desc)) : $desc?>
		</td>
		<td style='color:#888'>
	<?=$time->timeAgoInWords($change['Change']['created'])?>
		</td>
	</tr>
<? } ?>
<?=$this->javascript->codeBlock("
	if($$('.undone1').last()) {
		$$('.undone1').last().up('tr').previous('tr',7).scrollIntoView(true);
		setScroll();
	}
");?>
</table>
</div>
</fieldset>
<? if ($changes) { ?>
<?=$ajax->link('Time Spent',array('action'=>'timeSpent'),array(
	'before'=>'wait()',
	'update' => 'dialog_content',
))?>
<? } ?>
<?=$this->element('message');?>
