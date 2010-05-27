<div class="offDays form">
<?php echo $form->create('OffDay');?>
	<fieldset>
 		<legend><?php __('Edit OffDay');?></legend>
	<?php
		echo $form->input('id');
		echo $form->input('day');
		echo $form->input('person_id');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Delete', true), array('action' => 'delete', $form->value('OffDay.id')), null, sprintf(__('Are you sure you want to delete # %s?', true), $form->value('OffDay.id'))); ?></li>
		<li><?php echo $html->link(__('List OffDays', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
	</ul>
</div>
