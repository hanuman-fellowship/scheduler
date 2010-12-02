<?=$javascript->link(array('functions','dropdowntabs'));?>
<?=$html->css("dialog") ?>
<? $hidden = !$this->session->read('Schedule.editable');?>
<? $scheduleName = $this->session->read('Schedule.name');?>
<? $userName = Inflector::humanize(Authsome::get('username')); ?>
<? $gaps = isset($person['Person']) ? false : true;?>
<?=$role->menu(array(
	'Login' => array(
		'role' => array(''),
		'url' => array('controller' => 'users', 'action' => 'login'),
		'shortcut' => 'ctrl+l',
		'ajax'
	),
	"Hello, {$userName}" => array(
		'role' => array('operations','manager','personnel')
	),	
	'Personnel' => array(
		'role' => array('personnel'),
		'url' => array('controller' => 'personnelNotes', 'action' => 'edit'),
		'ajax',
		'sub' => array(
			'Notes for Operations...' => array(
				'url' => array('controller' => 'personnelNotes', 'action' => 'edit'),
				'ajax',
				'shortcut' => 'ctrl+n'
			),
			"<hr/>",
			'Change Password...' => array(
				'url' => array('controller' => 'users', 'action' => 'changePassword'),
				'ajax'
			),
			'Logout' => array(
				'url' => array('controller' => 'users', 'action' => 'logout'),
				'shortcut' => 'ctrl+l'
			)
		)
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
			'View Request...' => array(
				'url' => array('controller' => 'RequestAreas', 'action' => 'view'),
				'ajax',
				'shortcut' => 'ctrl+r'
			),
			"<hr/>",
			'Change Password...' => array(
				'url' => array('controller' => 'users', 'action' => 'changePassword'),
				'ajax'
			),
			'Logout' => array(
				'url' => array('controller' => 'users', 'action' => 'logout'),
				'shortcut' => 'ctrl+l'
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
				'ajax',
				'shortcut' => 'ctrl+h'
			),
			'View Past...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'past'),
				'ajax',
				'shortcut' => 'ctrl+o'
			),
			'View Gaps' => array(
				'url' => array('controller' => 'people', 'action' => 'schedule','gaps'),
				'shortcut' => 'ctrl+g'
			),
			"<hr/>",
			'New Working Copy...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'add'),
				'ajax',
				'shortcut' => 'shift+ctrl+n'
			),
			'Delete...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'delete'),
				'ajax',
				'shortcut' => 'shift+ctrl+d'
			),
			'Merge...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'merge'),
				'ajax',
				'hidden' => $hidden,
				'shortcut' => 'ctrl+m'
			)
		)
	),
	array(
		'title' => ' | ',
		'role' => array('operations'),
	),
	'People' => array(
		'url' => array('controller' => 'people', 'action' => 'schedule'),
		'shortcut' => 'ctrl+p',
		'ajax',
		'sub' => array(
			'hidden' => $hidden,
			'role' => array('operations'),
			'View Schedule...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'schedule'),
				'ajax',
				'shortcut' => 'ctrl+p'
			),
			'View Profile...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'profile'),
				'ajax'
			),
			"<hr/>",
			'New Person...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'people', 'action' => 'add'),
				'ajax',
				'shortcut' => 'shift+ctrl+p'
			),
			"<hr/>",
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
		'shortcut' => 'ctrl+a',
		'ajax',
		'sub' => array(
			'hidden' => $hidden,
			'role' => array('operations'),
			'View Schedule...' => array(
				'url' => array('controller' => 'areas', 'action' => 'select'),
				'ajax',
				'shortcut' => 'ctrl+a'
			),
			"<hr/>",
			'New Area...' => array(
				'role' => array('operations'),
				'url' => array('controller' => 'areas', 'action' => 'add'),
				'ajax'
			),
			"<hr/>",
			'Clear Area...' => array(
				'role' => array('operations'),
				'url' => array(
					'controller' => 'areas',
					'action' => 'clear',
					(isset($area)) ? $area : null 
				),
				'ajax',
				'shortcut' => 'ctrl+c'
			),
			'Delete Area...' => array(
				'role' => array('operations'),
				'url' => array(
					'controller' => 'areas',
					'action' => 'delete',
					(isset($area)) ? $area : null 
				),
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
				'ajax',
				'shortcut' => 'ctrl+s'
			),
			'New Floating Shift...' => array(
				'url' => array(
					'controller' => 'floating_shifts',
					'action' => 'add',
					(isset($area)) ? $area : 0, 
					(isset($person) && !$gaps) ? $person : 0 
				),
				'ajax',
				'shortcut' => 'ctrl+f'
			),
			'New Constant Shift...' => array(
				'url' => array('controller' => 'constant_shifts', 'action' => 'add'),
				'ajax'
			)
		)
	)
));
if ($session->read('Schedule.editable') && !isset($this->viewVars['area']['RequestArea'])) {
?>
<?= $this->element('shortcut',array(
	'shortcut' => 'ctrl+u',
	'codeBlock' => "clickLink($('undoLink'))"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'ctrl+r',
	'codeBlock' => "clickLink($('redoLink'))"
));?>
<div class='changes'>
	<span class='change_message' id='undo_message' style='display:none'><?=$change_messages['undo']?></span>
	<span class='change_message' id='redo_message' style='display:none'><?=$change_messages['redo']?></span>
	<?= $change_messages['redo'] ? $html->link('Redo',array('controller'=>'changes','action'=>'redo'),array(
		'onmouseover' => "$('redo_message').show()",
		'onmouseout' => "$('redo_message').hide()",
		'id' => 'redoLink',
		'title' => 'ctrl+r'
	)) : "<span class='no_link'>Redo</span>";?>
	<?= $change_messages['undo'] ? $html->link('Undo',array('controller'=>'changes','action'=>'undo'),array(
		'onmouseover' => "$('undo_message').show()",
		'onmouseout' => "$('undo_message').hide()",
		'id' => 'undoLink',
		'title' => 'ctrl+u'
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
