<div class="peopleShifts form">
<?php echo $form->create('PeopleShift');?>
	<fieldset>
 		<legend><?php __('Edit PeopleShift');?></legend>
	<?php
		echo $form->input('id');
		echo $form->input('person_id');
		echo $form->input('shift_id');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Delete', true), array('action' => 'delete', $form->value('PeopleShift.id')), null, sprintf(__('Are you sure you want to delete # %s?', true), $form->value('PeopleShift.id'))); ?></li>
		<li><?php echo $html->link(__('List PeopleShifts', true), array('action' => 'index'));?></li>
	</ul>
</div>
