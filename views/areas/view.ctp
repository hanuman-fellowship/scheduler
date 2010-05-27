<div class="areas view">
<h2><?php  __('Area');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $area['Area']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Name'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $area['Area']['name']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Short Name'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $area['Area']['short_name']; ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit Area', true), array('action' => 'edit', $area['Area']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete Area', true), array('action' => 'delete', $area['Area']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $area['Area']['id'])); ?> </li>
		<li><?php echo $html->link(__('List Areas', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Area', true), array('action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Floating Shifts', true), array('controller' => 'floating_shifts', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Floating Shift', true), array('controller' => 'floating_shifts', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Shifts', true), array('controller' => 'shifts', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Shift', true), array('controller' => 'shifts', 'action' => 'add')); ?> </li>
	</ul>
</div>
<div class="related">
	<h3><?php __('Related Floating Shifts');?></h3>
	<?php if (!empty($area['FloatingShift'])):?>
	<table cellpadding = "0" cellspacing = "0">
	<tr>
		<th><?php __('Id'); ?></th>
		<th><?php __('Person Id'); ?></th>
		<th><?php __('Area Id'); ?></th>
		<th><?php __('Hours'); ?></th>
		<th><?php __('Note'); ?></th>
		<th class="actions"><?php __('Actions');?></th>
	</tr>
	<?php
		$i = 0;
		foreach ($area['FloatingShift'] as $floatingShift):
			$class = null;
			if ($i++ % 2 == 0) {
				$class = ' class="altrow"';
			}
		?>
		<tr<?php echo $class;?>>
			<td><?php echo $floatingShift['id'];?></td>
			<td><?php echo $floatingShift['person_id'];?></td>
			<td><?php echo $floatingShift['area_id'];?></td>
			<td><?php echo $floatingShift['hours'];?></td>
			<td><?php echo $floatingShift['note'];?></td>
			<td class="actions">
				<?php echo $html->link(__('View', true), array('controller' => 'floating_shifts', 'action' => 'view', $floatingShift['id'])); ?>
				<?php echo $html->link(__('Edit', true), array('controller' => 'floating_shifts', 'action' => 'edit', $floatingShift['id'])); ?>
				<?php echo $html->link(__('Delete', true), array('controller' => 'floating_shifts', 'action' => 'delete', $floatingShift['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $floatingShift['id'])); ?>
			</td>
		</tr>
	<?php endforeach; ?>
	</table>
<?php endif; ?>

	<div class="actions">
		<ul>
			<li><?php echo $html->link(__('New Floating Shift', true), array('controller' => 'floating_shifts', 'action' => 'add'));?> </li>
		</ul>
	</div>
</div>
<div class="related">
	<h3><?php __('Related Shifts');?></h3>
	<?php if (!empty($area['Shift'])):?>
	<table cellpadding = "0" cellspacing = "0">
	<tr>
		<th><?php __('Id'); ?></th>
		<th><?php __('Area Id'); ?></th>
		<th><?php __('Day'); ?></th>
		<th><?php __('Time'); ?></th>
		<th><?php __('Length'); ?></th>
		<th><?php __('Num People'); ?></th>
		<th class="actions"><?php __('Actions');?></th>
	</tr>
	<?php
		$i = 0;
		foreach ($area['Shift'] as $shift):
			$class = null;
			if ($i++ % 2 == 0) {
				$class = ' class="altrow"';
			}
		?>
		<tr<?php echo $class;?>>
			<td><?php echo $shift['id'];?></td>
			<td><?php echo $shift['area_id'];?></td>
			<td><?php echo $shift['day'];?></td>
			<td><?php echo $shift['time'];?></td>
			<td><?php echo $shift['length'];?></td>
			<td><?php echo $shift['num_people'];?></td>
			<td class="actions">
				<?php echo $html->link(__('View', true), array('controller' => 'shifts', 'action' => 'view', $shift['id'])); ?>
				<?php echo $html->link(__('Edit', true), array('controller' => 'shifts', 'action' => 'edit', $shift['id'])); ?>
				<?php echo $html->link(__('Delete', true), array('controller' => 'shifts', 'action' => 'delete', $shift['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $shift['id'])); ?>
			</td>
		</tr>
	<?php endforeach; ?>
	</table>
<?php endif; ?>

	<div class="actions">
		<ul>
			<li><?php echo $html->link(__('New Shift', true), array('controller' => 'shifts', 'action' => 'add'));?> </li>
		</ul>
	</div>
</div>
