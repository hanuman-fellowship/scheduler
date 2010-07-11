<fieldset>
	<legend><?php __('View Area Schedule');?></legend>
<?
foreach(array('overlay_0'=>'none','overlay_1'=>'') as $overlay => $disp) {
	echo "<div id='{$overlay}' style='display:{$disp}'>";
	foreach($areas as $id => $name) {
		if($overlay == 'overlay_0') {
			$type = 'ajax';
			$attributes = array(
				'update' => 'dialog_content',
				'complete' => "openDialog('1_1','true')"
			);
		} else {
			$type = 'html';
			$attributes = null;
		}
		echo ${$type}->link($name,array('action'=>'schedule',$id),$attributes).'<br/>';
	}
	echo "</div>";
}
?>
<br>
<span style="float:right">
<input id="overlay" type="checkbox" onclick="swap('overlay_1','overlay_0')" />
<label for='overlay'>Overlay</label>
</span>
</fieldset>
