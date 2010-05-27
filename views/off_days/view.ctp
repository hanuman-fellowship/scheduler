<div class="offDays view">
<h2><?php  __('OffDay');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $offDay['OffDay']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Day'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $offDay['OffDay']['day']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Person'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $html->link($offDay['Person']['id'], array('controller' => 'people', 'action' => 'view', $offDay['Person']['id'])); ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit OffDay', true), array('action' => 'edit', $offDay['OffDay']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete OffDay', true), array('action' => 'delete', $offDay['OffDay']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $offDay['OffDay']['id'])); ?> </li>
		<li><?php echo $html->link(__('List OffDays', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New OffDay', true), array('action' => 'add')); ?> </li>
		<li><?php echo $html->link(__('List People', true), array('controller' => 'people', 'action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New Person', true), array('controller' => 'people', 'action' => 'add')); ?> </li>
	</ul>
</div>
