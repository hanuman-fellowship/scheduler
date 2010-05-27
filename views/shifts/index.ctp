<div class="shifts index">
<h2><?php __('Shifts');?></h2>
<p>
<?php
echo $paginator->counter(array(
'format' => __('Page %page% of %pages%, showing %current% records out of %count% total, starting on record %start%, ending on %end%', true)
));
?></p>
<table cellpadding="0" cellspacing="0">
<tr>
	<th><?php echo $paginator->sort('id');?></th>
	<th><?php echo $paginator->sort('area_id');?></th>
	<th><?php echo $paginator->sort('day');?></th>
	<th><?php echo $paginator->sort('time');?></th>
	<th><?php echo $paginator->sort('length');?></th>
	<th><?php echo $paginator->sort('num_people');?></th>
	<th class="actions"><?php __('Actions');?></th>
</tr>
<?php
$i = 0;
foreach ($shifts as $shift):
	$class = null;
	if ($i++ % 2 == 0) {
		$class = ' class="altrow"';
	}
?>
	<tr<?php echo $class;?>>
		<td>
			<?php echo $shift['Shift']['id']; ?>
		</td>
		<td>
			<?php echo $html->link($shift['Area']['name'], array('controller' => 'areas', 'action' => 'view', $shift['Area']['id'])); ?>
		</td>
		<td>
			<?php echo $shift['Shift']['day']; ?>
		</td>
		<td>
			<?php echo $shift['Shift']['time']; ?>
		</td>
		<td>
			<?php echo $shift['Shift']['length']; ?>
		</td>
		<td>
			<?php echo $shift['Shift']['num_people']; ?>
		</td>
		<td class="actions">
			<?php echo $html->link(__('View', true), array('action' => 'view', $shift['Shift']['id'])); ?>
			<?php echo $html->link(__('Edit', true), array('action' => 'edit', $shift['Shift']['id'])); ?>
			<?php echo $html->link(__('Delete', true), array('action' => 'delete', $shift['Shift']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $shift['Shift']['id'])); ?>
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
		<li><?php echo $html->link(__('New Shift', true), array('action' => 'add')); ?></li>
		<li><?php echo $html->link(__('List Areas', true), array('controller' => 'areas', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Area', true), array('controller' => 'areas', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
	</ul>
</div>
