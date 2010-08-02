<div class="people form">
	<fieldset>
 		<legend><?php __('Retire Person');?></legend>
<?
$rcId = 0;
echo "<div class='tall'>";
	foreach($people as $person) {
		if ($rcId != $person['PeopleSchedules']['resident_category_id']) {
			if ($rcId != 0) { echo "</div>";};
			echo "<div class='left' style='float:left;padding:10px'><strong>{$person['PeopleSchedules']['ResidentCategory']['name']}</strong><br/>";	
			$rcId = $person['PeopleSchedules']['resident_category_id'];
		}
		echo $html->link($person['Person']['name'],array($person['Person']['id']),array(
			'class' => 'remove_RC_' . $person['PeopleSchedules']['resident_category_id']
		)) . '<br>';
	}
?>
	</div>
	</fieldset>
</div>
