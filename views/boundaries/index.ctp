<div class="boundaries index">
<h2><?php __('Boundaries');?></h2>
<p>
<?php
echo $paginator->counter(array(
'format' => __('Page %page% of %pages%, showing %current% records out of %count% total, starting on record %start%, ending on %end%', true)
));
?></p>
<table cellpadding="0" cellspacing="0">
<tr>
	<th><?php echo $paginator->sort('id');?></th>
	<th><?php echo $paginator->sort('day_id');?></th>
	<th><?php echo $paginator->sort('time_id');?></th>
	<th><?php echo $paginator->sort('start');?></th>
	<th class="actions"><?php __('Actions');?></th>
</tr>
<?php
$i = 0;
foreach ($boundaries as $boundary):
	$class = null;
	if ($i++ % 2 == 0) {
		$class = ' class="altrow"';
	}
?>
	<tr<?php echo $class;?>>
		<td>
			<?php echo $boundary['Boundary']['id']; ?>
		</td>
		<td>
			<?php echo $html->link($boundary['Day']['name'], array('controller' => 'days', 'action' => 'view', $boundary['Day']['id'])); ?>
		</td>
		<td>
			<?php echo $html->link($boundary['Time']['name'], array('controller' => 'times', 'action' => 'view', $boundary['Time']['id'])); ?>
		</td>
		<td>
			<?php echo $boundary['Boundary']['start']; ?>
		</td>
		<td class="actions">
			<?php echo $html->link(__('View', true), array('action' => 'view', $boundary['Boundary']['id'])); ?>
			<?php echo $html->link(__('Edit', true), array('action' => 'edit', $boundary['Boundary']['id'])); ?>
			<?php echo $html->link(__('Delete', true), array('action' => 'delete', $boundary['Boundary']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $boundary['Boundary']['id'])); ?>
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
		<li><?php echo $html->link(__('New Boundary', true), array('action' => 'add')); ?></li>
		<li><?php echo $html->link(__('List Days', true), array('controller' => 'days', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Day', true), array('controller' => 'days', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Times', true), array('controller' => 'times', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Time', true), array('controller' => 'times', 'action' => 'add')); ?> </li>
	</ul>
</div>
