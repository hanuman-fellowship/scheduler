<fieldset>
	<legend><?php __('Delete User');?></legend>
<div class='tall left'>
<?
foreach($users as $user) {
	echo $html->link(
		$user['User']['username'].' ('.$user['User']['role'].')',
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
