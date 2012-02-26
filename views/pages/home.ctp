<?$this->set('title_for_layout', "Scheduler")?>
<?=$this->element('menu');?>
<?=$this->element('schedule_message')?>
<br>
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
