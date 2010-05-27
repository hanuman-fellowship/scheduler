<div class="constantShifts view">
<h2><?php  __('ConstantShift');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $constantShift['ConstantShift']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Resident Category'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $html->link($constantShift['ResidentCategory']['name'], array('controller' => 'resident_categories', 'action' => 'view', $constantShift['ResidentCategory']['id'])); ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Name'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $constantShift['ConstantShift']['name']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Day'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $constantShift['ConstantShift']['day']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Start'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $constantShift['ConstantShift']['start']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('End'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $constantShift['ConstantShift']['end']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Length'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $constantShift['ConstantShift']['length']; ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit ConstantShift', true), array('action' => 'edit', $constantShift['ConstantShift']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete ConstantShift', true), array('action' => 'delete', $constantShift['ConstantShift']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $constantShift['ConstantShift']['id'])); ?> </li>
		<li><?php echo $html->link(__('List ConstantShifts', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New ConstantShift', true), array('action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Resident Categories', true), array('controller' => 'resident_categories', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Resident Category', true), array('controller' => 'resident_categories', 'action' => 'add')); ?> </li>
	</ul>
</div>
