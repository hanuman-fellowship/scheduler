<div id='hoursBy' style='display:none'>
<fieldset>
	<legend><?php __('Hour Breakdown');?></legend>
<div class='tall'>
<table>
	<?foreach($data as $name => $hours) {?>
	<tr>
		<td style='text-align:right;padding:10px;'>
			<?=$name?>:
		</td>
		<td style='text-align:left'>
			<?=$hours?>
		</td>
	</tr>
	<? } ?>
</table>
</div>
</fieldset>
</div>
