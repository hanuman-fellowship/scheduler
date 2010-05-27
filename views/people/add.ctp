<div class="people form">
<?php echo $form->create('Person');?>
	<fieldset>
 		<legend><?php __('Add Person');?></legend>
	<?php
		echo $form->input('nickname');
		echo $form->input('first');
		echo $form->input('last');
		echo $form->input('resident_category_id');
		echo $form->input('house_id');
		echo $form->input('Shift');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('List People', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List Resident Categories', true), array('controller' => 'resident_categories', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Resident Category', true), array('controller' => 'resident_categories', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Houses', true), array('controller' => 'houses', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New House', true), array('controller' => 'houses', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Floating Shifts', true), array('controller' => 'floating_shifts', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Floating Shift', true), array('controller' => 'floating_shifts', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Off Days', true), array('controller' => 'off_days', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Off Day', true), array('controller' => 'off_days', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Shifts', true), array('controller' => 'shifts', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Shift', true), array('controller' => 'shifts', 'action' => 'add')); ?> </li>
	</ul>
</div>
