<div class="constantShifts index">
<h2><?php __('ConstantShifts');?></h2>
<p>
<?php
echo $paginator->counter(array(
'format' => __('Page %page% of %pages%, showing %current% records out of %count% total, starting on record %start%, ending on %end%', true)
));
?></p>
<table cellpadding="0" cellspacing="0">
<tr>
	<th><?php echo $paginator->sort('id');?></th>
	<th><?php echo $paginator->sort('resident_category_id');?></th>
	<th><?php echo $paginator->sort('name');?></th>
	<th><?php echo $paginator->sort('day');?></th>
	<th><?php echo $paginator->sort('start');?></th>
	<th><?php echo $paginator->sort('end');?></th>
	<th><?php echo $paginator->sort('length');?></th>
	<th class="actions"><?php __('Actions');?></th>
</tr>
<?php
$i = 0;
foreach ($constantShifts as $constantShift):
	$class = null;
	if ($i++ % 2 == 0) {
		$class = ' class="altrow"';
	}
?>
	<tr<?php echo $class;?>>
		<td>
			<?php echo $constantShift['ConstantShift']['id']; ?>
		</td>
		<td>
			<?php echo $html->link($constantShift['ResidentCategory']['name'], array('controller' => 'resident_categories', 'action' => 'view', $constantShift['ResidentCategory']['id'])); ?>
		</td>
		<td>
			<?php echo $constantShift['ConstantShift']['name']; ?>
		</td>
		<td>
			<?php echo $constantShift['ConstantShift']['day']; ?>
		</td>
		<td>
			<?php echo $constantShift['ConstantShift']['start']; ?>
		</td>
		<td>
			<?php echo $constantShift['ConstantShift']['end']; ?>
		</td>
		<td>
			<?php echo $constantShift['ConstantShift']['length']; ?>
		</td>
		<td class="actions">
			<?php echo $html->link(__('View', true), array('action' => 'view', $constantShift['ConstantShift']['id'])); ?>
			<?php echo $html->link(__('Edit', true), array('action' => 'edit', $constantShift['ConstantShift']['id'])); ?>
			<?php echo $html->link(__('Delete', true), array('action' => 'delete', $constantShift['ConstantShift']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $constantShift['ConstantShift']['id'])); ?>
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
		<li><?php echo $html->link(__('New ConstantShift', true), array('action' => 'add')); ?></li>
		<li><?php echo $html->link(__('List Resident Categories', true), array('controller' => 'resident_categories', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Resident Category', true), array('controller' => 'resident_categories', 'action' => 'add')); ?> </li>
	</ul>
</div>
