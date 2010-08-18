<? $last = $session->check('last_person') ?
	$session->read('last_person') : '';
?>
<fieldset>
	<legend><?php __('View Person Schedule');?></legend>
<?
echo "<div class='tall'>";
$rcId = 0;
foreach($people as $person) {
	$attributes = array(
		'onClick' => 'wait()',
		'class' => 'RC_' . $person['PeopleSchedules']['resident_category_id']
	);
	if ($rcId != $person['PeopleSchedules']['resident_category_id']) {
		if ($rcId != 0) { echo "</div>";};
		echo "<div class='left' style='float:left;padding:10px'>
			<strong>{$person['PeopleSchedules']['ResidentCategory']['name']}</strong><br>";	
		$rcId = $person['PeopleSchedules']['resident_category_id'];
	}
	$last_style = ($last == $person['Person']['id']) ? array('<b><i>','</i></b>') : array('','');
	echo $last_style[0].
	$html->link(
		$person['Person']['name'],
		array('action'=>'schedule',$person['Person']['id']),
		$attributes
	) . $last_style[1].'<br>';
}
echo '</div></div>';
?>
</fieldset>
<?=$this->element('message');?>
