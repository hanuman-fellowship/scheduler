<fieldset>
	<legend><?php __('Delete User');?></legend>
<div class='tall left'>
<?
foreach($users as $user) {
	echo $html->link(
		Inflector::humanize($user['User']['username']),
		array($user['User']['id']),
		array(
			'class' => 'remove',
			'onClick' => 'wait()'
		)
	).'<br/>';
}
?>
</div>
</fieldset>
<?=$this->element('message');?>
