<div class="peopleShifts view">
<h2><?php  __('PeopleShift');?></h2>
	<dl><?php $i = 0; $class = ' class="altrow"';?>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $peopleShift['PeopleShift']['id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Person Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $peopleShift['PeopleShift']['person_id']; ?>
			&nbsp;
		</dd>
		<dt<?php if ($i % 2 == 0) echo $class;?>><?php __('Shift Id'); ?></dt>
		<dd<?php if ($i++ % 2 == 0) echo $class;?>>
			<?php echo $peopleShift['PeopleShift']['shift_id']; ?>
			&nbsp;
		</dd>
	</dl>
</div>
<div class="actions">
	<ul>
		<li><?php echo $html->link(__('Edit PeopleShift', true), array('action' => 'edit', $peopleShift['PeopleShift']['id'])); ?> </li>
		<li><?php echo $html->link(__('Delete PeopleShift', true), array('action' => 'delete', $peopleShift['PeopleShift']['id']), null, sprintf(__('Are you sure you want to delete # %s?', true), $peopleShift['PeopleShift']['id'])); ?> </li>
		<li><?php echo $html->link(__('List PeopleShifts', true), array('action' => 'index')); ?> </li>
		<li><?php echo $html->link(__('New PeopleShift', true), array('action' => 'add')); ?> </li>
	</ul>
</div>
