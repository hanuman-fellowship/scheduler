<div class="boundaries form">
<?php echo $form->create('Boundary');?>
	<fieldset>
 		<legend><?php __('Add Boundary');?></legend>
	<?php
		echo $form->input('day_id');
		echo $form->input('time_id');
		echo $form->input('start');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('List Boundaries', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List Days', true), array('controller' => 'days', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Day', true), array('controller' => 'days', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Times', true), array('controller' => 'times', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Time', true), array('controller' => 'times', 'action' => 'add')); ?> </li>
	</ul>
</div>
