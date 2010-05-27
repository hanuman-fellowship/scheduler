<div class="areas index">
<h2><?php __('Areas');?></h2>
<p>
<?php
echo $paginator->counter(array(
'format' => __('Page %page% of %pages%, showing %current% records out of %count% total, starting on record %start%, ending on %end%', true)
));
?></p>
<table cellpadding="0" cellspacing="0">
<tr>
	<th><?php echo $paginator->sort('id');?></th>
	<th><?php echo $paginator->sort('name');?></th>
	<th><?php echo $paginator->sort('short_name');?></th>
	<th class="actions"><?php __('Actions');?></th>
</tr>
<?php
$i = 0;
foreach ($areas as $area):
	$class = null;
	if ($i++ % 2 == 0) {
		$class = ' class="altrow"';
	}
?>
	<tr<?php echo $class;?>>
		<td>
			<?php echo $area['Area']['id']; ?>
		</td>
		<td>
			<?php echo $area['Area']['name']; ?>
		</td>
		<td>
			<?php echo $area['Area']['short_name']; ?>
		</td>
		<td class="actions">
			<?php echo $html->link(__('View', true), array('action' => 'view', $area['Area']['id'])); ?>
			<?php echo $html->link(__('Edit', true), array('action' => 'edit', $area['Area']['id'])); ?>
			<?php echo $html->link(__('Delete', true), array('action' => 'delete', $area['Area']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $area['Area']['id'])); ?>
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
		<li><?php echo $html->link(__('New Area', true), array('action' => 'add')); ?></li>
		<li><?php echo $html->link(__('List Floating Shifts', true), array('controller' => 'floating_shifts', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Floating Shift', true), array('controller' => 'floating_shifts', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Shifts', true), array('controller' => 'shifts', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Shift', true), array('controller' => 'shifts', 'action' => 'add')); ?> </li>
	</ul>
</div>
