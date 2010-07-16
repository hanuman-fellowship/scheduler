<fieldset>
	<legend><?php __('View Profile');?></legend>
<div style="max-height:500px;overflow:auto">
<?
foreach($people as $person) {
	echo $html->link(
		$person['Person']['first'],
		array(
			'action' => 'profile', 
			$person['Person']['id']
		)
	);
	echo '<br/>';
}
?>
</div>
</fieldset>
