<?=$javascript->link(array('functions','progress','dropdowntabs'));?>
<?=$html->css("dialog") ?>
<? $hidden = !$this->session->read('Schedule.editable');?>
<? $scheduleName = $this->session->read('Schedule.name');?>
<? $userName = Inflector::humanize(Authsome::get('username')); ?>
<? $gaps = isset($person['Person']) ? false : true;?>
<?=$role->menu(array(
	'Login' => array(
		'role' => array(''),
		'url' => array('controller' => 'users', 'action' => 'login'),
		'ajax'
	),
	"Hello, {$userName}" => array(
		'role' => array('operations','manager')
	),	
	'Operations' => array(
		'role' => array('operations'),
		'url' => '',
		'sub' => array(
			'New User...' => array(
				'url' => array('controller' => 'users', 'action' => 'add'),
				'ajax'
			),
			'Edit User...' => array(
				'url' => array('controller' => 'users', 'action' => 'edit'),
				'ajax'
			),
			'Delete User...' => array(
				'url' => array('controller' => 'users', 'action' => 'delete'),
				'ajax'
			),
			"<hr/>",
			'Change Password...' => array(
				'url' => array('controller' => 'users', 'action' => 'changePassword'),
				'ajax'
			),
			'Logout' => array(
				'url' => array('controller' => 'users', 'action' => 'logout'),
			)
		)
	),	
	'Manager' => array(
		'role' => array('manager'),
		'url' => '',
		'sub' => $managerMenu
	),
	array(
		'title' => ' | '
	),
	'Schedules' => array(
		'role' => array('operations'),
		'url' => array('controller' => 'schedules', 'action' => 'select'),
		'ajax',
		'sub' => array(
			'Select...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'select'),
				'ajax'
			),
			'View Past...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'past'),
				'ajax'
			),
			'View Gaps' => array(
				'url' => array('controller' => 'people', 'action' => 'schedule','gaps')
			),
			"<hr/>",
			'New Working Copy...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'add'),
				'ajax'
			),
			'Delete...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'delete'),
				'ajax'
			),
			'Merge...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'merge'),
				'ajax',
				'hidden' => $hidden
			),
			array(
				'title' => "<hr/>",
				'hidden' => $hidden,
			),
			'Publish...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'publish'),
				'confirm' => "Publish the schedule: \"{$scheduleName}\"? \nThis action can't be undone.",
				'hidden' => $hidden
			)
		)
	),
	array(
		'title' => ' | ',
		'role' => array('operations'),
	),
	'People' => array(
		'url' => array('controller' => 'people', 'action' => 'schedule'),
		'ajax',
		'sub' => array(
			'hidden' => $hidden,
			'role' => array('operations'),
			'View Schedule...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'schedule'),
				'ajax'
			),
			'View Profile...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'profile'),
				'ajax'
			),
			"<hr/>" => array(
				'role' => array('operations')
			),
			'New Person...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'add'),
				'ajax'
			),
			'Restore Person...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'restore'),
				'ajax'
			),
			'Retire Person...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'retire'),
				'ajax'
			)
		)
	),
	'Areas' => array(
		'url' => array('controller' => 'areas', 'action' => 'select'),
		'ajax',
		'sub' => array(
			'hidden' => $hidden,
			'role' => array('operations'),
			'View Schedule...' => array(
				'url' => array('controller' => 'areas', 'action' => 'select'),
				'ajax'
			),
			"<hr/>" => array(
				'role' => array('operations')
			),
			'New Area...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'areas', 'action' => 'add'),
				'ajax'
			),
			'Delete Area...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'areas', 'action' => 'delete'),
				'ajax'
			),
		)
	),
	'Shifts' => array(
		'hidden' => $hidden,
		'role' => array('operations'),
		'url' => array(
			'controller' => 'shifts',
			'action' => 'add',
			(isset($area)) ? $area : null 
		),
		'ajax',
		'sub' => array(
			'New Shift...' => array(
				'url' => array(
					'controller' => 'shifts',
					'action' => 'add',
					(isset($area)) ? $area : null 
				),
				'ajax'
			),
			'New Floating Shift...' => array(
				'url' => array(
					'controller' => 'floating_shifts',
					'action' => 'add',
					(isset($area)) ? $area : 0, 
					(isset($person) && !$gaps) ? $person : 0 
				),
				'ajax'
			),
			'New Constant Shift...' => array(
				'url' => array('controller' => 'constant_shifts', 'action' => 'add'),
				'ajax'
			)
		)
	)
));
if ($session->read('Schedule.editable')) {
?>
<div class='changes'>
	<span class='change_message' id='undo_message'><?=$change_messages['undo']?></span>
	<span class='change_message' id='redo_message'><?=$change_messages['redo']?></span>
	<?= $change_messages['redo'] ? $html->link('Redo',array('controller'=>'changes','action'=>'redo'),array(
		'onmouseover' => "showElement('redo_message')",
		'onmouseout' => "hideElement('redo_message')"
	)) : "<span class='no_link'>Redo</span>";?>
	<?= $change_messages['undo'] ? $html->link('Undo',array('controller'=>'changes','action'=>'undo'),array(
		'onmouseover' => "showElement('undo_message')",
		'onmouseout' => "hideElement('undo_message')"
	)) : "<span class='no_link'>Undo</span>";?>
	<?=$ajax->link('View History',
		array('controller'=>'changes','action'=>'history'),
		array(
			'update'=>'dialog_content',
			'complete' => "openDialog('history_link',true,'bottom')",
			'id'=>'history_link'
		)
	);?>
</div>
<?
}
?>
