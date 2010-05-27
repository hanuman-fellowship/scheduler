<div class="areas form">
<?php echo $form->create('Area');?>
	<fieldset>
 		<legend><?php __('Edit Area');?></legend>
	<?php
		echo $form->input('id');
		echo $form->input('name');
		echo $form->input('short_name');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Delete', true), array('action' => 'delete', $form->value('Area.id')), null, sprintf(__('Are you sure you want to delete # %s?', true), $form->value('Area.id'))); ?></li>
		<li><?php echo $html->link(__('List Areas', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List Floating Shifts', true), array('controller' => 'floating_shifts', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Floating Shift', true), array('controller' => 'floating_shifts', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Shifts', true), array('controller' => 'shifts', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Shift', true), array('controller' => 'shifts', 'action' => 'add')); ?> </li>
	</ul>
</div>
