<fieldset>
	<legend><?php __('View Profile');?></legend>
<?
foreach($people as $person) {
	echo $html->link(
		$person['Person']['name'],
		array(
			'action' => 'profile', 
			$person['Person']['id'],
			$person['Person']['schedule_id']
		)
	);
	echo '<br/>';
}
?>
</fieldset>
