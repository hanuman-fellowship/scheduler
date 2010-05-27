<div class="floatingShifts index">
<h2><?php __('FloatingShifts');?></h2>
<p>
<?php
echo $paginator->counter(array(
'format' => __('Page %page% of %pages%, showing %current% records out of %count% total, starting on record %start%, ending on %end%', true)
));
?></p>
<table cellpadding="0" cellspacing="0">
<tr>
	<th><?php echo $paginator->sort('id');?></th>
	<th><?php echo $paginator->sort('person_id');?></th>
	<th><?php echo $paginator->sort('area_id');?></th>
	<th><?php echo $paginator->sort('hours');?></th>
	<th><?php echo $paginator->sort('note');?></th>
	<th class="actions"><?php __('Actions');?></th>
</tr>
<?php
$i = 0;
foreach ($floatingShifts as $floatingShift):
	$class = null;
	if ($i++ % 2 == 0) {
		$class = ' class="altrow"';
	}
?>
	<tr<?php echo $class;?>>
		<td>
			<?php echo $floatingShift['FloatingShift']['id']; ?>
		</td>
		<td>
			<?php echo $html->link($floatingShift['Person']['id'], array('controller' => 'people', 'action' => 'view', $floatingShift['Person']['id'])); ?>
		</td>
		<td>
			<?php echo $html->link($floatingShift['Area']['name'], array('controller' => 'areas', 'action' => 'view', $floatingShift['Area']['id'])); ?>
		</td>
		<td>
			<?php echo $floatingShift['FloatingShift']['hours']; ?>
		</td>
		<td>
			<?php echo $floatingShift['FloatingShift']['note']; ?>
		</td>
		<td class="actions">
			<?php echo $html->link(__('View', true), array('action' => 'view', $floatingShift['FloatingShift']['id'])); ?>
			<?php echo $html->link(__('Edit', true), array('action' => 'edit', $floatingShift['FloatingShift']['id'])); ?>
			<?php echo $html->link(__('Delete', true), array('action' => 'delete', $floatingShift['FloatingShift']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $floatingShift['FloatingShift']['id'])); ?>
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
		<li><?php echo $html->link(__('New FloatingShift', true), array('action' => 'add')); ?></li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Areas', true), array('controller' => 'areas', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Area', true), array('controller' => 'areas', 'action' => 'add')); ?> </li>
	</ul>
</div>
