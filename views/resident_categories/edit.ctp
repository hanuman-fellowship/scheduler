<div class="residentCategories form">
<?php echo $form->create('ResidentCategory');?>
	<fieldset>
 		<legend><?php __('Edit ResidentCategory');?></legend>
	<?php
		echo $form->input('id');
		echo $form->input('name');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Delete', true), array('action' => 'delete', $form->value('ResidentCategory.id')), null, sprintf(__('Are you sure you want to delete # %s?', true), $form->value('ResidentCategory.id'))); ?></li>
		<li><?php echo $html->link(__('List ResidentCategories', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List Constant Shifts', true), array('controller' => 'constant_shifts', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Constant Shift', true), array('controller' => 'constant_shifts', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
	</ul>
</div>
