<?=$javascript->link(array('functions','progress','dropdowntabs'));?>
<?=$html->css("dialog") ?>
<? $hidden = !$this->session->read('Schedule.editable');?>
<? $scheduleName = $this->session->read('Schedule.name');?>
<? $userName = Inflector::humanize(Authsome::get('username')); ?>
<?=$role->menu(array(
	'Login' => array(
		'role' => array(''),
		'url' => array('controller' => 'users', 'action' => 'login'),
		'ajax'
	),
	"Hello, {$userName}" => array(
		'role' => array('operations')
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
				'ajax'
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
		'url' => array('controller' => 'areas', 'action' => 'schedule'),
		'ajax',
		'sub' => array(
			'hidden' => $hidden,
			'role' => array('operations'),
			'View Schedule...' => array(
				'url' => array('controller' => 'areas', 'action' => 'schedule'),
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
					(isset($person)) ? $person : 0 
				),
				'ajax'
			),
			'New Constant Shift...' => array(
				'url' => array('controller' => 'constant_shifts', 'action' => 'add'),
				'ajax'
			)
		)
	)
));?>
