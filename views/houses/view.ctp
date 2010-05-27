<div class="houses view">
<h2><?php  __('House');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $house['House']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Name'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $house['House']['name']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Size'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $house['House']['size']; ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit House', true), array('action' => 'edit', $house['House']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete House', true), array('action' => 'delete', $house['House']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $house['House']['id'])); ?> </li>
		<li><?php echo $html->link(__('List Houses', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New House', true), array('action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
	</ul>
</div>
<div class="related">
	<h3><?php __('Related People');?></h3>
	<?php if (!empty($house['Person'])):?>
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
		foreach ($house['Person'] as $person):
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
