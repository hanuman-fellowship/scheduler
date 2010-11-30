<script type='text/javascript'>
shortcut.add("<?=$shortcut?>",function() {
	<?=$codeBlock?>;
	},{
		'type':'keydown',
		'propagate':<?= isset($propagate)? $propagate : 'false'?>,
		'disable_in_dialog':<?= isset($disable_in_dialog)? $disable_in_dialog : 'false'?>,
		'target':<?= isset($target)? "$('{$target}')" : "document"?>
	});
</script>
