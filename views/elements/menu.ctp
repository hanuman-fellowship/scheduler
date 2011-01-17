<?
$isOperations = in_array(
	'operations',
	Set::combine(Authsome::get('Role'),'{n}.id','{n}.name')
);
$editable = $this->Session->read('Schedule.editable');
?>
<span class='no_print'>
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
			'Email Users...' => array(
				'url' => array('controller' => 'users', 'action' => 'emailUsers'),
				'ajax',
				'shortcut' => 'ctrl+e'
			),
			"<hr/>",
			'View Request...' => array(
				'url' => array('controller' => 'RequestAreas', 'action' => 'view'),
				'ajax',
				'shortcut' => 'ctrl+r'
			),
			'Clear Requests...' => array(
				'url' => array('controller' => 'RequestAreas', 'action' => 'delete'),
				'ajax',
				'shortcut' => 'ctrl+d'
			),
			"<hr/>",
			'Email Settings...' => array(
				'url' => array('controller' => 'EmailAuths', 'action' => 'edit'),
				'ajax'
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
	'Personnel' => array(
		'role' => array('personnel'),
		'url' => array('controller' => 'personnelNotes', 'action' => 'edit'),
		'ajax',
		'sub' => array(
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
			'Works in Progress...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'select'),
				'ajax'
			),
			'Published...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'published'),
				'ajax',
				'shortcut' => 'ctrl+o'
			),
			"<hr/>",
			'View Gaps' => array(
				'url' => array('controller' => 'people', 'action' => 'schedule','gaps'),
				'shortcut' => 'ctrl+g'
			),
			"<hr/>",
			'Edit a Copy...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'copy'),
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
			'role' => array('operations'),
			'View Schedule...' => array(
				'hidden' => $hidden,
				'url' => array('controller' => 'people', 'action' => 'schedule'),
				'ajax',
				'shortcut' => 'ctrl+p'
			),
			'Big Board' => array(
				'url' => array('controller' => 'people', 'action' => 'board'),
				'shortcut' => 'ctrl+b'
			),
			array('hidden'=>$hidden,'title'=>"<hr/>"),
			'New Person...' => array(
				'hidden' => $hidden,
				'url' => array('controller' => 'people', 'action' => 'add'),
				'ajax',
				'shortcut' => 'shift+ctrl+p'
			),
			array('hidden'=>$hidden,'title'=>"<hr/>"),
			'Restore Person...' => array(
				'hidden' => $hidden,
				'url' => array('controller' => 'people', 'action' => 'restore'),
				'ajax'
			),
			'Retire Person...' => array(
				'hidden' => $hidden,
				'url' => array('controller' => 'people', 'action' => 'retire'),
				'ajax'
			),
			array('hidden'=>$hidden,'title'=>"<hr/>"),
			"Affected Schedules..." => array(
				'url' => array(
					'controller' => 'people',
					'action' => 'changed'
				),
				'hidden' => $hidden,
				'ajax'
			),
			'Print People...' => array(
				'url' => array(
					'controller' => 'people',
					'action' => 'printm',
					(isset($person) && !isset($gaps)) ? $person : null 
				),
				'ajax'
			),
		)
	),
	'Areas' => array(
		'url' => array('controller' => 'areas', 'action' => 'select'),
		'shortcut' => 'ctrl+a',
		'ajax',
		'sub' => array(
			'role' => array('operations'),
			'View Schedule...' => array(
				'hidden' => $hidden,
				'url' => array('controller' => 'areas', 'action' => 'select'),
				'ajax',
				'shortcut' => 'ctrl+a'
			),
			array('hidden'=>$hidden,'title'=>"<hr/>"),
			'New Area...' => array(
				'hidden' => $hidden,
				'url' => array('controller' => 'areas', 'action' => 'add'),
				'ajax'
			),
			array('hidden'=>$hidden,'title'=>"<hr/>"),
			'Clear Area...' => array(
				'hidden' => $hidden,
				'url' => array(
					'controller' => 'areas',
					'action' => 'clear',
					(isset($area)) ? $area : null 
				),
				'ajax',
				'shortcut' => 'ctrl+c'
			),
			'Delete Area...' => array(
				'hidden' => $hidden,
				'url' => array(
					'controller' => 'areas',
					'action' => 'delete',
					(isset($area)) ? $area : null 
				),
				'ajax'
			),
			array('hidden'=>$hidden,'title'=>"<hr/>"),
			"Affected Schedules..." => array(
				'url' => array(
					'controller' => 'areas',
					'action' => 'changed'
				),
				'hidden' => $hidden,
				'ajax'
			),
			'Print Areas...' => array(
				'url' => array(
					'controller' => 'areas',
					'action' => 'printm',
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
if ($isOperations && !isset($this->viewVars['area']['RequestArea'])) {
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
	<? if ($editable) { ?>
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
	<? } ?>
	<?=$ajax->link('View All Changes',
		array('controller'=>'changes','action'=>'history'),
		array(
			'update'=>'dialog_content',
			'complete' => "openDialog('history_link',true,'bottom')",
			'id'=>'history_link'
		)
	);?>
</div>
<? } ?>
</span>
