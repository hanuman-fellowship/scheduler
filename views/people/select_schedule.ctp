<? $last = $session->check('last_person') ?
	$session->read('last_person') : '';
?>
<fieldset>
	<legend><span id='drag_handle'><?php __('View Person Schedule');?></span></legend>
<?
foreach(array('overlay_0'=>'none','overlay_1'=>'') as $overlay => $disp) {
	echo "<div id='{$overlay}' class='tall' style='display:{$disp}'>";
	$rcId = 0;
	foreach($people as $person) {
        if($overlay == 'overlay_0') {
			$type = 'ajax';
			$attributes = array(
				'before' => 'wait()',
				'update' => 'dialog_content',
				'complete' => "openDialog('1_1','#FFF','true')"
			);
		} else {
			$type = 'html';
			$attributes = array(
				'onClick' => 'wait()'
			);
		}
		$attributes['class'] = 'RC_' . $person['PeopleSchedules']['resident_category_id'];
		if ($rcId != $person['PeopleSchedules']['resident_category_id']) {
			if ($rcId != 0) { echo "</div>";};
			echo "<div class='left' style='float:left;padding:10px'><strong>{$person['PeopleSchedules']['ResidentCategory']['name']}</strong><br>";	
			$rcId = $person['PeopleSchedules']['resident_category_id'];
		}
		$last_style = ($last == $person['Person']['id']) ? array('<i>','</i>') : array('','');
		echo $last_style[0].
		${$type}->link($person['Person']['name'],array('action'=>'schedule',$person['Person']['id']),$attributes) . $last_style[1].'<br>';
	}
	echo '</div></div>';
}
?>
	<div style="clear:both;float:right;">
		<input id="overlay" type="checkbox" onclick="swap('overlay_1','overlay_0')" />
		<label for='overlay'>Overlay</label>
	</div>
</fieldset>
<?=$this->element('message');?>
