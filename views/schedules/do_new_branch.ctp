<h2><?php echo $this->pageTitle = 'New Branch'; ?></h2>
<?php echo $form->create(false, array('action' => 'doNewBranch'));?>
	<?php
		echo $form->input('name');
	?>
<?php echo $form->end('Submit');?>
