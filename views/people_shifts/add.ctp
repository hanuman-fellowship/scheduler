<div class="peopleShifts form">
<?php echo $form->create('PeopleShift');?>
	<fieldset>
 		<legend><?php __('Add PeopleShift');?></legend>
	<?php
		echo $form->input('person_id');
		echo $form->input('shift_id');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('List PeopleShifts', true), array('action' => 'index'));?></li>
	</ul>
</div>
