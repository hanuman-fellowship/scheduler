<? $last = $session->check('last_area') ?
	$session->read('last_area') : '';
?>
<fieldset>
	<legend><?php __('View Area Schedule');?></legend>
<?
foreach(array('overlay_0'=>'none','overlay_1'=>'') as $overlay => $disp) {
	echo "<div id='{$overlay}' class='tall left'  style='display:{$disp}'>";
	foreach($areas as $id => $name) {
		if($overlay == 'overlay_0') {
			$type = 'ajax';
			$attributes = array(
				'before' => 'wait()',
				'update' => 'dialog_content',
				'complete' => "openDialog('1_1','true')"
			);
		} else {
			$type = 'html';
			$attributes = array(
				'onClick' => 'wait()'
			);;
		}
		$last_style = ($last == $id) ? array('<b><i>','</i></b>') : array('','');
		echo $last_style[0].
		${$type}->link($name,array('action'=>'schedule',$id),$attributes).
		$last_style[1].'<br/>';
		
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
<?=$this->element('message');?>
