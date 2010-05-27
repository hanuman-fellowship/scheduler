<div class="days view">
<h2><?php  __('Day');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $day['Day']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Name'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $day['Day']['name']; ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit Day', true), array('action' => 'edit', $day['Day']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete Day', true), array('action' => 'delete', $day['Day']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $day['Day']['id'])); ?> </li>
		<li><?php echo $html->link(__('List Days', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Day', true), array('action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Boundaries', true), array('controller' => 'boundaries', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Boundary', true), array('controller' => 'boundaries', 'action' => 'add')); ?> </li>
	</ul>
</div>
<div class="related">
	<h3><?php __('Related Boundaries');?></h3>
	<?php if (!empty($day['Boundary'])):?>
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
		foreach ($day['Boundary'] as $boundary):
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
