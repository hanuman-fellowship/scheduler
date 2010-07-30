<div style="position:fixed;display:none" id="dialog"><div id="outer" class='out'>
	<div id="dialog_content" class='in ltin tpin' onclick="clickInDialog()">
	</div>
</div></div>
<?= $this->ajax->drag('dialog', array('scroll' => 'window'));?>
