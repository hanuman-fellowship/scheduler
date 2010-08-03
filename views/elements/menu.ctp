<?=$javascript->link(array('functions','progress'));?>
<?=$html->css("dialog") ?>
<?=$role->menu(array(
	'Login' => array(
		'role' => array(''),
		'url' => array('controller' => 'users', 'action' => 'login'),
		'ajax'
	),
	"Hello, ".Inflector::humanize(Authsome::get('username')) => array(
		'role' => array('operations')
	),	
	'Logout' => array(
		'role' => array('operations'),
		'url' => array('controller' => 'users', 'action' => 'logout')
	),	
	array(
		'title' => ' | '
	),
	'Schedules' => array(
		'role' => array('operations'),
		'url' => '#',
		'sub' => array(
			'Select Schedule...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'select'),
				'ajax'
			),
			"<hr/>",
			'New Schedule...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'add'),
				'ajax'
			),
			'Delete Schedule...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'delete'),
				'ajax'
			),
			'Merge Schedule...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'merge'),
				'ajax'
			)
		)
	),
	array(
		'title' => ' | ',
		'role' => array('operations')
	),
	'Undo' => array(
		'role' => array('operations'),
		'url' => array('controller' => 'changes', 'action' => 'undo'),
		'sub' => $changes['undo']
	),
	'Redo' => array(
		'role' => array('operations'),
		'url' => array('controller' => 'changes', 'action' => 'redo'),
		'sub' => $changes['redo']
	),
	array(
		'title' => ' | ',
		'role' => array('operations')
	),
	'People' => array(
		'url' => array('controller' => 'people', 'action' => 'schedule'),
		'ajax',
		'sub' => array(
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
		'role' => array('operations'),
		'url' => '#',
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
