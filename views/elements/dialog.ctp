<div id="behind_dialog" style="display:none;position:absolute;left:0;top:0;background:#000;opacity:0;filter:alpha(opacity=0);">
</div>
<div style="position:fixed;display:none" id="dialog"><div id="outer" class='out'>
	<div id="dialog_content" class='in ltin tpin' onclick="clickInDialog()">
	</div>
</div></div>
<? $this->ajax->drag('dialog', array('scroll' => 'window'));?>
