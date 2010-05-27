<div class="houses index">
<h2><?php __('Houses');?></h2>
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
	<th><?php echo $paginator->sort('size');?></th>
	<th class="actions"><?php __('Actions');?></th>
</tr>
<?php
$i = 0;
foreach ($houses as $house):
	$class = null;
	if ($i++ % 2 == 0) {
		$class = ' class="altrow"';
	}
?>
	<tr<?php echo $class;?>>
		<td>
			<?php echo $house['House']['id']; ?>
		</td>
		<td>
			<?php echo $house['House']['name']; ?>
		</td>
		<td>
			<?php echo $house['House']['size']; ?>
		</td>
		<td class="actions">
			<?php echo $html->link(__('View', true), array('action' => 'view', $house['House']['id'])); ?>
			<?php echo $html->link(__('Edit', true), array('action' => 'edit', $house['House']['id'])); ?>
			<?php echo $html->link(__('Delete', true), array('action' => 'delete', $house['House']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $house['House']['id'])); ?>
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
		<li><?php echo $html->link(__('New House', true), array('action' => 'add')); ?></li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
	</ul>
</div>
