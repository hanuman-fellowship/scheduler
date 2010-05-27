<div class="constantShifts form">
<?php echo $form->create('ConstantShift');?>
	<fieldset>
 		<legend><?php __('Edit ConstantShift');?></legend>
	<?php
		echo $form->input('id');
		echo $form->input('resident_category_id');
		echo $form->input('name');
		echo $form->input('day');
		echo $form->input('start');
		echo $form->input('end');
		echo $form->input('length');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Delete', true), array('action' => 'delete', $form->value('ConstantShift.id')), null, sprintf(__('Are you sure you want to delete # %s?', true), $form->value('ConstantShift.id'))); ?></li>
		<li><?php echo $html->link(__('List ConstantShifts', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List Resident Categories', true), array('controller' => 'resident_categories', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Resident Category', true), array('controller' => 'resident_categories', 'action' => 'add')); ?> </li>
	</ul>
</div>
