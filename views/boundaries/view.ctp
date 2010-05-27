<div class="boundaries view">
<h2><?php  __('Boundary');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $boundary['Boundary']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Day'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $html->link($boundary['Day']['name'], array('controller' => 'days', 'action' => 'view', $boundary['Day']['id'])); ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Time'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $html->link($boundary['Time']['name'], array('controller' => 'times', 'action' => 'view', $boundary['Time']['id'])); ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Start'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $boundary['Boundary']['start']; ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit Boundary', true), array('action' => 'edit', $boundary['Boundary']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete Boundary', true), array('action' => 'delete', $boundary['Boundary']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $boundary['Boundary']['id'])); ?> </li>
		<li><?php echo $html->link(__('List Boundaries', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Boundary', true), array('action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Days', true), array('controller' => 'days', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Day', true), array('controller' => 'days', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Times', true), array('controller' => 'times', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Time', true), array('controller' => 'times', 'action' => 'add')); ?> </li>
	</ul>
</div>
