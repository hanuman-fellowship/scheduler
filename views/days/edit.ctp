<div class="days form">
<?php echo $form->create('Day');?>
	<fieldset>
 		<legend><?php __('Edit Day');?></legend>
	<?php
		echo $form->input('id');
		echo $form->input('name');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Delete', true), array('action' => 'delete', $form->value('Day.id')), null, sprintf(__('Are you sure you want to delete # %s?', true), $form->value('Day.id'))); ?></li>
		<li><?php echo $html->link(__('List Days', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List Boundaries', true), array('controller' => 'boundaries', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Boundary', true), array('controller' => 'boundaries', 'action' => 'add')); ?> </li>
	</ul>
</div>
