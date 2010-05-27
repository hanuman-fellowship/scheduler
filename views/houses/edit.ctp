<div class="houses form">
<?php echo $form->create('House');?>
	<fieldset>
 		<legend><?php __('Edit House');?></legend>
	<?php
		echo $form->input('id');
		echo $form->input('name');
		echo $form->input('size');
	?>
	</fieldset>
<?php echo $form->end('Submit');?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Delete', true), array('action' => 'delete', $form->value('House.id')), null, sprintf(__('Are you sure you want to delete # %s?', true), $form->value('House.id'))); ?></li>
		<li><?php echo $html->link(__('List Houses', true), array('action' => 'index'));?></li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
	</ul>
</div>
