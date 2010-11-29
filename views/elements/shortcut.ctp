<script type='text/javascript'>
shortcut.add("<?=$shortcut?>",function() {
	<?=$codeBlock?>;
	},{
		'type':'keydown',
		'disable_in_dialog':<?= isset($disable_in_dialog)? $disable_in_dialog : 'false'?>,
		'target':<?= isset($target)? "$('{$target}')" : "document"?>
	});
</script>
