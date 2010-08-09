<fieldset>
	<legend><?php __('View Profile');?></legend>
<div class='tall left'>
<?
foreach($people as $person) {
	echo $html->link(
		$person['Person']['name'],
		array(
			'action' => 'profile', 
			$person['Person']['id']
		),
		array('onClick' => 'wait()')
	);
	echo '<br/>';
}
?>
</div>
</fieldset>
<?=$this->element('message');?>