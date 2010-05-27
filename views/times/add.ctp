<div class="times form">
<?php echo $form->create('Time');?>
	<fieldset>
 		<legend><?php __('Add Time');?></legend>
	<?php
		echo $form->input('name');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('List Times', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List Boundaries', true), array('controller' => 'boundaries', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Boundary', true), array('controller' => 'boundaries', 'action' => 'add')); ?> </li>
	</ul>
</div>
