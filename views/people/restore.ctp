<div class="people form">
	<fieldset>
 		<legend><?php __('Restore Person');?></legend>
<?
echo "<div style='float:left;padding:10px;'>";
	foreach($people as $person) {
		echo $html->link("{$person['Person']['last']}, {$person['Person']['first']}",array($person['Person']['id'])) . '<br>';
	}
?>
	</div>
	</fieldset>
</div>
