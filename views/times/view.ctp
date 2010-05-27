<div class="times view">
<h2><?php  __('Time');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $time['Time']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Name'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $time['Time']['name']; ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit Time', true), array('action' => 'edit', $time['Time']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete Time', true), array('action' => 'delete', $time['Time']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $time['Time']['id'])); ?> </li>
		<li><?php echo $html->link(__('List Times', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Time', true), array('action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Boundaries', true), array('controller' => 'boundaries', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Boundary', true), array('controller' => 'boundaries', 'action' => 'add')); ?> </li>
	</ul>
</div>
<div class="related">
	<h3><?php __('Related Boundaries');?></h3>
	<?php if (!empty($time['Boundary'])):?>
	<table cellpadding = "0" cellspacing = "0">
	<tr>
		<th><?php __('Id'); ?></th>
		<th><?php __('Day Id'); ?></th>
		<th><?php __('Time Id'); ?></th>
		<th><?php __('Start'); ?></th>
		<th class="actions"><?php __('Actions');?></th>
	</tr>
	<?php
		$i = 0;
		foreach ($time['Boundary'] as $boundary):
			$class = null;
			if ($i++ % 2 == 0) {
				$class = ' class="altrow"';
			}
		?>
		<tr<?php echo $class;?>>
			<td><?php echo $boundary['id'];?></td>
			<td><?php echo $boundary['day_id'];?></td>
			<td><?php echo $boundary['time_id'];?></td>
			<td><?php echo $boundary['start'];?></td>
			<td class="actions">
				<?php echo $html->link(__('View', true), array('controller' => 'boundaries', 'action' => 'view', $boundary['id'])); ?>
				<?php echo $html->link(__('Edit', true), array('controller' => 'boundaries', 'action' => 'edit', $boundary['id'])); ?>
				<?php echo $html->link(__('Delete', true), array('controller' => 'boundaries', 'action' => 'delete', $boundary['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $boundary['id'])); ?>
			</td>
		</tr>
	<?php endforeach; ?>
	</table>
<?php endif; ?>

	<div class="actions">
		<ul>
			<li><?php echo $html->link(__('New Boundary', true), array('controller' => 'boundaries', 'action' => 'add'));?> </li>
		</ul>
	</div>
</div>
