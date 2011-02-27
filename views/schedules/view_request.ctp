<? if (isset($requests)) { ?>
	<fieldset>
		<legend><?php __('View Request');?></legend>
	<?
	foreach($requests as $id => $name) {
		echo $ajax->link($name,array($id),array(
			'before' => 'wait()',
			'update' => 'dialog_content',
			'complete' => "openDialog('menu_Operations',true,'bottom',true)"
		));
		echo '<br/>';
	}
	?>
	</fieldset>
<? } else { ?>
	<?=$this->element('schedule_content',array('request'=>true))?>
<? } ?>
<?=$this->element('message');?>
