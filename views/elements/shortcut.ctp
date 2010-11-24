<script type='text/javascript'>
shortcut.add("<?=$shortcut?>",function() {
	<?=$codeBlock?>;
	},{
		'type':'keydown',
		'target':<?= isset($target)? "$('{$target}')" : "document"?>
	});
</script>
