	<fieldset>
 		<legend><?php __('Restore Person');?></legend>
<div class='left tall'>
<?
if (!isset($id)) {
	foreach($people as $person) {
		echo $ajax->link("{$person['Person']['last']}, {$person['Person']['first']}",
			array($person['Person']['id']),
			array(
				'before' => 'wait()',
				'update' => 'dialog_content'
			)
		) . '<br>';
	}
} else { ?>
Please choose a category:<hr>
<?
	foreach($categories as $category => $name) {
		echo $html->link(
			$name,
			array($id, $category),
			array('onClick'=>'wait()')
		)."<br>";
	}
}
?>
	</div>
	</fieldset>
<?=$this->element('message');?>
