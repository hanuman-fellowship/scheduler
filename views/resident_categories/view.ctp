<div class="residentCategories view">
<h2><?php  __('ResidentCategory');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $residentCategory['ResidentCategory']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Name'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $residentCategory['ResidentCategory']['name']; ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit ResidentCategory', true), array('action' => 'edit', $residentCategory['ResidentCategory']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete ResidentCategory', true), array('action' => 'delete', $residentCategory['ResidentCategory']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $residentCategory['ResidentCategory']['id'])); ?> </li>
		<li><?php echo $html->link(__('List ResidentCategories', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New ResidentCategory', true), array('action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Constant Shifts', true), array('controller' => 'constant_shifts', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Constant Shift', true), array('controller' => 'constant_shifts', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
	</ul>
</div>
<div class="related">
	<h3><?php __('Related Constant Shifts');?></h3>
	<?php if (!empty($residentCategory['ConstantShift'])):?>
	<table cellpadding = "0" cellspacing = "0">
	<tr>
		<th><?php __('Id'); ?></th>
		<th><?php __('Resident Category Id'); ?></th>
		<th><?php __('Name'); ?></th>
		<th><?php __('Day'); ?></th>
		<th><?php __('Start'); ?></th>
		<th><?php __('End'); ?></th>
		<th><?php __('Length'); ?></th>
		<th class="actions"><?php __('Actions');?></th>
	</tr>
	<?php
		$i = 0;
		foreach ($residentCategory['ConstantShift'] as $constantShift):
			$class = null;
			if ($i++ % 2 == 0) {
				$class = ' class="altrow"';
			}
		?>
		<tr<?php echo $class;?>>
			<td><?php echo $constantShift['id'];?></td>
			<td><?php echo $constantShift['resident_category_id'];?></td>
			<td><?php echo $constantShift['name'];?></td>
			<td><?php echo $constantShift['day'];?></td>
			<td><?php echo $constantShift['start'];?></td>
			<td><?php echo $constantShift['end'];?></td>
			<td><?php echo $constantShift['length'];?></td>
			<td class="actions">
				<?php echo $html->link(__('View', true), array('controller' => 'constant_shifts', 'action' => 'view', $constantShift['id'])); ?>
				<?php echo $html->link(__('Edit', true), array('controller' => 'constant_shifts', 'action' => 'edit', $constantShift['id'])); ?>
				<?php echo $html->link(__('Delete', true), array('controller' => 'constant_shifts', 'action' => 'delete', $constantShift['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $constantShift['id'])); ?>
			</td>
		</tr>
	<?php endforeach; ?>
	</table>
<?php endif; ?>

	<div class="actions">
		<ul>
			<li><?php echo $html->link(__('New Constant Shift', true), array('controller' => 'constant_shifts', 'action' => 'add'));?> </li>
		</ul>
	</div>
</div>
<div class="related">
	<h3><?php __('Related People');?></h3>
	<?php if (!empty($residentCategory['Person'])):?>
	<table cellpadding = "0" cellspacing = "0">
	<tr>
		<th><?php __('Id'); ?></th>
		<th><?php __('Nickname'); ?></th>
		<th><?php __('First'); ?></th>
		<th><?php __('Last'); ?></th>
		<th><?php __('Resident Category Id'); ?></th>
		<th><?php __('House Id'); ?></th>
		<th class="actions"><?php __('Actions');?></th>
	</tr>
	<?php
		$i = 0;
		foreach ($residentCategory['Person'] as $person):
			$class = null;
			if ($i++ % 2 == 0) {
				$class = ' class="altrow"';
			}
		?>
		<tr<?php echo $class;?>>
			<td><?php echo $person['id'];?></td>
			<td><?php echo $person['nickname'];?></td>
			<td><?php echo $person['first'];?></td>
			<td><?php echo $person['last'];?></td>
			<td><?php echo $person['resident_category_id'];?></td>
			<td><?php echo $person['house_id'];?></td>
			<td class="actions">
				<?php echo $html->link(__('View', true), array('controller' => 'people', 'action' => 'view', $person['id'])); ?>
				<?php echo $html->link(__('Edit', true), array('controller' => 'people', 'action' => 'edit', $person['id'])); ?>
				<?php echo $html->link(__('Delete', true), array('controller' => 'people', 'action' => 'delete', $person['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $person['id'])); ?>
			</td>
		</tr>
	<?php endforeach; ?>
	</table>
<?php endif; ?>

	<div class="actions">
		<ul>
			<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add'));?> </li>
		</ul>
	</div>
</div>
