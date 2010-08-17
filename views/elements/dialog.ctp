<div id="behind_dialog" style="display:none;position:absolute;left:0;top:0;background:#000;opacity:0;filter:alpha(opacity=0);">
</div>
<div id="dialog">
	<div id="outer">
		<div id='drag_here'></div>
		<div id="dialog_content"></div>
	</div>
</div>
<?$this->ajax->drag('dialog', array('scroll' => 'window'));?>
