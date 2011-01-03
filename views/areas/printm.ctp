<? $this->set('title_for_layout', "Print Areas"); ?>
<div class='no_print'>
<?=$html->link("&larr; Go Back",$back,array('escape'=>false))?>
<hr>
</div>
<?=$output?>
<script type='text/javascript'>
	window.print()
</script>
