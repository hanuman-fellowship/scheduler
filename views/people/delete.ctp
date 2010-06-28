<div class="people form">
	<fieldset>
 		<legend><?php __('Delete Person');?></legend>
<?
$rcId = 0;
echo "<div style='float:left;padding:10px;'>";
	foreach($people as $person) {
		if ($rcId != $person['Person']['resident_category_id']) {
			echo "</div><div style='float:left;padding:10px'><strong>{$person['ResidentCategory']['name']}</strong><br/>";	
			$rcId = $person['Person']['resident_category_id'];
		}
		echo $html->link($person['Person']['name'],array($person['Person']['id']),array(
			'class' => 'remove_RC_' . $person['Person']['resident_category_id']
		)) . '<br>';
	}
?>
	</div>
	</fieldset>
</div>

