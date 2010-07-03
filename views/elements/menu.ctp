<?=$javascript->link('functions');?>
<?=$html->css("dialog") ?>
<?=$role->menu(array(
	'Login' => array(
		'role' => array(''),
		'url' => array('controller' => 'users', 'action' => 'login'),
		'ajax' => array(
			'update'=>'dialog_content',
			'complete'=>"openDialog('menu_Login','#FFF','true')",
			'id' => 'menu_Login'
		)
	),
	"Hello, ".Inflector::humanize(Authsome::get('username')) => array(
		'role' => array('operations')
	),	
	'Logout' => array(
		'role' => array('operations'),
		'url' => array('controller' => 'users', 'action' => 'logout')
	),	
	' | ',
	'People' => array(
		'url' => '#',
		'sub' => array(
			'View Schedule...' => array(
				'url' => array('controller' => 'people', 'action' => 'schedule'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('view_person_schedule','#EEE','true')",
					'id' => 'view_person_schedule'
				)
			),
			'View Profile...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'profiles', 'action' => 'view'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('person_view_profile','#EEE','true')",
					'id' => 'person_view_profile'
				)
			),
			"<hr/>" => array(
				'role' => array('operations')
			),
			'New Person...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'add'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('person_add','#7BC684','true')",
					'id' => 'person_add'
				)
			),
			'Delete Person...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'delete'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('person_delete','#CCCCCC','true')",
					'id' => 'person_delete'
				)
			)
		)
	),
	'Areas' => array(
		'url' => '#',
		'sub' => array(
			'View Schedule...' => array(
				'url' => array('controller' => 'areas', 'action' => 'schedule'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('view_area_schedule','#A3C2D8','true')",
					'id' => 'view_area_schedule'
				)
			),
			"<hr/>" => array(
				'role' => array('operations')
			),
			'New Area...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'areas', 'action' => 'add'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('area_add','#EEE','true')",
					'id' => 'area_add'
				)
			),
			'Delete Area...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'areas', 'action' => 'delete'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('area_delete','#CCCCCC','true')",
					'id' => 'area_delete'
				)
			),
		)
	),
	'Shifts' => array(
		'role' => array('operations'),
		'url' => '#',
		'sub' => array(
			'New Shift...' => array(
				'url' => array('controller' => 'shifts', 'action' => 'add'),
				'ajax' => array(
					'update'=>'dialog_content',
					'complete'=>"openDialog('shift_new','#ACBFDA','true')",
					'id' => 'shift_new'
				)
			),
			'New Floating Shift...' => array(
				'url' => array('controller' => 'floating_shifts', 'action' => 'add'),
				'ajax' => array(
					'update'=>'dialog_content',
					'complete'=>"openDialog('floating_shift_new','#FFF','true')",
					'id' => 'floating_shift_new'
				)
			),
			'New Constant Shift...' => array(
				'url' => array('controller' => 'constant_shifts', 'action' => 'add'),
				'ajax' => array(
					'update'=>'dialog_content',
					'complete'=>"openDialog('constant_shift_new','#FFF','true')",
					'id' => 'constant_shift_new'
				)
			)
		)
	),
	" | " => array(
		'role' => array('operations')
	),
	'Schedules' => array(
		'role' => array('operations'),
		'url' => '#',
		'sub' => array(
			'Select Schedule...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'selectBranch'),
				'ajax' => array(
					'update'=>'dialog_content',
					'complete'=>"openDialog('schedule_select','#FFF','true')",
					'id' => 'schedule_select'
				)
			),
			"<hr/>",
			'New Schedule...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'doNewBranch'),
				'ajax' => array(
					'update'=>'dialog_content',
					'complete'=>"openDialog('schedule_add','#FFF','true')",
					'id' => 'schedule_add'
				)
			),
			'Delete Schedule...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'doDeleteBranch'),
				'ajax' => array(
					'update'=>'dialog_content',
					'complete'=>"openDialog('schedule_delete','#FFF','true')",
					'id' => 'schedule_delete'
				)
			),
			'Merge Schedule...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'doMergeBranch'),
				'ajax' => array(
					'update'=>'dialog_content',
					'complete'=>"openDialog('schedule_merge','#FFF','true')",
					'id' => 'schedule_merge'
				)
			)
		)
	)
));?>
<!-- <?="Updated: " . $time->format('F jS, Y @ g:ia',$session->read('Schedule.updated')); ?> -->
