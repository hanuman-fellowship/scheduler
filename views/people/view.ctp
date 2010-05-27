<div class="people view">
<h2><?php  __('Person');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $person['Person']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Nickname'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $person['Person']['nickname']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('First'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $person['Person']['first']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Last'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $person['Person']['last']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Resident Category'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $html->link($person['ResidentCategory']['name'], array('controller' => 'resident_categories', 'action' => 'view', $person['ResidentCategory']['id'])); ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('House'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $html->link($person['House']['name'], array('controller' => 'houses', 'action' => 'view', $person['House']['id'])); ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit Person', true), array('action' => 'edit', $person['Person']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete Person', true), array('action' => 'delete', $person['Person']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $person['Person']['id'])); ?> </li>
		<li><?php echo $html->link(__('List People', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('action' => 'add')); ?> </li>
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
<div class="related">
	<h3><?php __('Related Floating Shifts');?></h3>
	<?php if (!empty($person['FloatingShift'])):?>
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
		foreach ($person['FloatingShift'] as $floatingShift):
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
	<h3><?php __('Related Off Days');?></h3>
	<?php if (!empty($person['OffDay'])):?>
	<table cellpadding = "0" cellspacing = "0">
	<tr>
		<th><?php __('Id'); ?></th>
		<th><?php __('Day'); ?></th>
		<th><?php __('Person Id'); ?></th>
		<th class="actions"><?php __('Actions');?></th>
	</tr>
	<?php
		$i = 0;
		foreach ($person['OffDay'] as $offDay):
			$class = null;
			if ($i++ % 2 == 0) {
				$class = ' class="altrow"';
			}
		?>
		<tr<?php echo $class;?>>
			<td><?php echo $offDay['id'];?></td>
			<td><?php echo $offDay['day'];?></td>
			<td><?php echo $offDay['person_id'];?></td>
			<td class="actions">
				<?php echo $html->link(__('View', true), array('controller' => 'off_days', 'action' => 'view', $offDay['id'])); ?>
				<?php echo $html->link(__('Edit', true), array('controller' => 'off_days', 'action' => 'edit', $offDay['id'])); ?>
				<?php echo $html->link(__('Delete', true), array('controller' => 'off_days', 'action' => 'delete', $offDay['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $offDay['id'])); ?>
			</td>
		</tr>
	<?php endforeach; ?>
	</table>
<?php endif; ?>

	<div class="actions">
		<ul>
			<li><?php echo $html->link(__('New Off Day', true), array('controller' => 'off_days', 'action' => 'add'));?> </li>
		</ul>
	</div>
</div>
<div class="related">
	<h3><?php __('Related Shifts');?></h3>
	<?php if (!empty($person['Shift'])):?>
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
		foreach ($person['Shift'] as $shift):
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
