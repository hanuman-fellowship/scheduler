<?$this->set('title_for_layout', "Scheduler")?>
<?=$this->element('menu');?>
<?=$this->element('schedule_message')?>
<br>
<div style='text-align:center;margin-right:auto;margin-left:auto;'>
	<?=$this->Html->link('View Big Board',
		array('controller' => 'people', 'action' => 'board'),
		array('style' => 'text-align:center;border:1px solid #ccc;padding:.5em;')
	)?>
</div>
<br>
<table style='border:3px solid #ccc;margin-right:auto;margin-left:auto;background-color:#DFDBC3;'>
	<tr>
		<td valign='top' class='left' style='padding:10px'>
			<?=$people?>
		</td>
		<td valign='top' class='left' style='padding:10px'>
			<?=$areas?>
		</td>
	</tr>
</table>
<?=$this->element('dialog')?>
