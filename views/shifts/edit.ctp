<div class="shifts form">
<?php echo $form->create('Shift');?>
	<fieldset>
 		<legend><?php __('Edit Shift');?></legend>
	<?php
		echo $form->input('id');
		echo $form->input('area_id');
		echo $form->input('day');
		echo $form->input('time');
		echo $form->input('length');
		echo $form->input('num_people');
		echo $form->input('Person');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Delete', true), array('action' => 'delete', $form->value('Shift.id')), null, sprintf(__('Are you sure you want to delete # %s?', true), $form->value('Shift.id'))); ?></li>
		<li><?php echo $html->link(__('List Shifts', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List Areas', true), array('controller' => 'areas', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Area', true), array('controller' => 'areas', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
	</ul>
</div>
