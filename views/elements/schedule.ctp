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
		'url' => array('controller' => 'people', 'action' => 'schedule'),
		'sub' => array(
			'View Schedule' => array(
				'url' => array('controller' => 'people', 'action' => 'schedule'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('view_person_schedule','#EEE','true')",
					'id' => 'view_person_schedule'
				)
			),
			'View Profile' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'profile'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('person_view_profile','#EEE','true')",
					'id' => 'person_view_profile'
				)
			),
			"<hr/>" => array(
				'role' => array('operations')
			),
			'New Person' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'add'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('person_add','#EEE','true')",
					'id' => 'person_add'
				)
			),
			'Delete Person' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'delete'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('person_delete','red','true')",
					'id' => 'person_delete'
				)
			)
		)
	),
	'Areas' => array(
		'url' => array('controller' => 'areas', 'action' => 'schedule'),
		'sub' => array(
			'View Schedule' => array(
				'url' => array('controller' => 'areas', 'action' => 'schedule'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('view_area_schedule','#EEE','true')",
					'id' => 'view_area_schedule'
				)
			),
			"<hr/>" => array(
				'role' => array('operations')
			),
			'New Area' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'areas', 'action' => 'add'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('area_add','#EEE','true')",
					'id' => 'area_add'
				)
			),
			'Delete Area' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'areas', 'action' => 'delete'),
				'ajax' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('area_delete','red','true')",
					'id' => 'area_delete'
				)
			),
		)
	),
	'Shifts' => array(
		'role' => array('operations'),
		'url' => '#',
		'sub' => array(
			'New Shift' => array(
				'url' => array('controller' => 'shifts', 'action' => 'add'),
				'ajax' => array(
					'update'=>'dialog_content',
					'complete'=>"openDialog('shift_new','#FFF','true')",
					'id' => 'shift_new'
				)
			),
			'New Floating Shift' => array(
				'url' => array('controller' => 'floating_shifts', 'action' => 'add'),
				'ajax' => array(
					'update'=>'dialog_content',
					'complete'=>"openDialog('floating_shift_new','#FFF','true')",
					'id' => 'floating_shift_new'
				)
			),
			'New Constant Shift' => array(
				'url' => array('controller' => 'constant_shifts', 'action' => 'add'),
				'ajax' => array(
					'update'=>'dialog_content',
					'complete'=>"openDialog('constant_shift_new','#FFF','true')",
					'id' => 'constant_shift_new'
				)
			)
		)
	)
));?>
<!--  <? if ($username = Authsome::get('username')) : ?>
	<?=$html->link('Undo',array('controller'=>'changes','action'=>'undo'));?>
	
	<?=$html->link('Redo',array('controller'=>'changes','action'=>'redo'));?>
	<?=$html->link('History',array('controller'=>'changes','action'=>'history'));?>
	<br/>
	<?=$html->link('New Area', array('controller' => 'areas', 'action' => 'add'));?>
	| <?=$html->link('View Area', array('controller' => 'areas', 'action' => 'schedule'));?>
	<br/>
	<?=$html->link('New Branch', array('controller' => 'schedules', 'action' => 'doNewBranch'));?>
	| <?=$html->link('Select Branch', array('controller' => 'schedules', 'action' => 'selectBranch'));?>
	| <?=$html->link('Delete Branch', array('controller' => 'schedules', 'action' => 'doDeleteBranch'));?>
	| <?=$html->link('Merge Branch', array('controller' => 'schedules', 'action' => 'doMergeBranch'));?>
  <? endif ?>
 <?="Updated: " . $time->format('F jS, Y @ g:ia',$session->read('Schedule.updated')); ?> -->
