	<fieldset>
 		<legend><?php __('Restore Person');?></legend>
<?
echo "<div class='left tall'>";
	foreach($people as $person) {
		echo $html->link("{$person['Person']['last']}, {$person['Person']['first']}",
			array($person['Person']['id']),
			array('onClick' => 'wait()')
		) . '<br>';
	}
?>
	</div>
	</fieldset>
<?=$this->element('message');?>
