<div class="people index">
<h2><?php __('People');?></h2>
<p>
<?php
echo $paginator->counter(array(
'format' => __('Page %page% of %pages%, showing %current% records out of %count% total, starting on record %start%, ending on %end%', true)
));
?></p>
<table cellpadding="0" cellspacing="0">
<tr>
	<th><?php echo $paginator->sort('id');?></th>
	<th><?php echo $paginator->sort('nickname');?></th>
	<th><?php echo $paginator->sort('first');?></th>
	<th><?php echo $paginator->sort('last');?></th>
	<th><?php echo $paginator->sort('resident_category_id');?></th>
	<th><?php echo $paginator->sort('house_id');?></th>
	<th class="actions"><?php __('Actions');?></th>
</tr>
<?php
$i = 0;
foreach ($people as $person):
	$class = null;
	if ($i++ % 2 == 0) {
		$class = ' class="altrow"';
	}
?>
	<tr<?php echo $class;?>>
		<td>
			<?php echo $person['Person']['id']; ?>
		</td>
		<td>
			<?php echo $person['Person']['nickname']; ?>
		</td>
		<td>
			<?php echo $person['Person']['first']; ?>
		</td>
		<td>
			<?php echo $person['Person']['last']; ?>
		</td>
		<td>
			<?php echo $html->link($person['ResidentCategory']['name'], array('controller' => 'resident_categories', 'action' => 'view', $person['ResidentCategory']['id'])); ?>
		</td>
		<td>
			<?php echo $html->link($person['House']['name'], array('controller' => 'houses', 'action' => 'view', $person['House']['id'])); ?>
		</td>
		<td class="actions">
			<?php echo $html->link(__('View', true), array('action' => 'view', $person['Person']['id'])); ?>
			<?php echo $html->link(__('Edit', true), array('action' => 'edit', $person['Person']['id'])); ?>
			<?php echo $html->link(__('Delete', true), array('action' => 'delete', $person['Person']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $person['Person']['id'])); ?>
		</td>
	</tr>
<?php endforeach; ?>
</table>
</div>
<div class="paging">
	<?php echo $paginator->prev('<< '.__('previous', true), array(), null, array('class'=>'disabled'));?>
 | 	<?php echo $paginator->numbers();?>
	<?php echo $paginator->next(__('next', true).' >>', array(), null, array('class' => 'disabled'));?>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('New Person', true), array('action' => 'add')); ?></li>
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
