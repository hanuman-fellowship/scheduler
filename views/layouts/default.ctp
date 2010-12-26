<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>
		<?=$title_for_layout?>
	</title>	
	<?=$html->css("schedule") ?>
	<?=$html->meta("smiley_favicon.ico",'smiley_favicon.ico',array('type'=>'icon')) ?>
	<?=$javascript->link('shortcut');?>
	<?=$javascript->link('prototype');?>
	<?=$javascript->link('scriptaculous');?>
	<?=$javascript->link('dragdrop');?>
	<?=$javascript->link('effects');?>
	<?= $this->element('keyboard_navigation')?>
</head>
<body  onload="setScroll()" onkeypress="typeActivate(event)">  
	<div id="container">
		<div id="content">
			<? if ($session->check('Message.flash')) { ?>
			<? 		$session->flash(); ?>
			<? } ?>
			<!-- content -->
			<?=$this->Session->flash('email')?>
			<?=$content_for_layout?>
		</div>
	</div>
</body>
</html>
