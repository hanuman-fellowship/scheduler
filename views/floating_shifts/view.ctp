<div class="floatingShifts view">
<h2><?php  __('FloatingShift');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $floatingShift['FloatingShift']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Person'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $html->link($floatingShift['Person']['id'], array('controller' => 'people', 'action' => 'view', $floatingShift['Person']['id'])); ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Area'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $html->link($floatingShift['Area']['name'], array('controller' => 'areas', 'action' => 'view', $floatingShift['Area']['id'])); ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Hours'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $floatingShift['FloatingShift']['hours']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Note'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $floatingShift['FloatingShift']['note']; ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit FloatingShift', true), array('action' => 'edit', $floatingShift['FloatingShift']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete FloatingShift', true), array('action' => 'delete', $floatingShift['FloatingShift']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $floatingShift['FloatingShift']['id'])); ?> </li>
		<li><?php echo $html->link(__('List FloatingShifts', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New FloatingShift', true), array('action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List Areas', true), array('controller' => 'areas', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Area', true), array('controller' => 'areas', 'action' => 'add')); ?> </li>
	</ul>
</div>
