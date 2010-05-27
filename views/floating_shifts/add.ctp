<div class="floatingShifts form">
<?php echo $form->create('FloatingShift');?>
	<fieldset>
 		<legend><?php __('Add FloatingShift');?></legend>
	<?php
		echo $form->input('person_id');
		echo $form->input('area_id');
		echo $form->input('hours');
		echo $form->input('note');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('List FloatingShifts', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Areas', true), array('controller' => 'areas', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Area', true), array('controller' => 'areas', 'action' => 'add')); ?> </li>
	</ul>
</div>
