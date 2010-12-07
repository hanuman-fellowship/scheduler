<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>
		<?=$title_for_layout?>
	</title>	
	<?=$html->css("screen") ?>
	<?=$javascript->link('shortcut');?>
	<?=$javascript->link('prototype');?>
	<?=$javascript->link('scriptaculous');?>
	<?=$javascript->link('dragdrop');?>
	<?= $this->element('keyboard_navigation')?>
</head>
<body  onload="setScroll()" onkeypress="typeActivate(event)">  
	<div id="container">
		<div id="content">
			<? if ($session->check('Message.flash')) { ?>
			<? 		$session->flash(); ?>
			<? } ?>
			<!-- content -->
			<?=$content_for_layout?>
		</div>
	</div>
</body>
</html>
