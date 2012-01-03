<?
$isOperations = in_array(
	'operations',
	Set::combine(Authsome::get('Role'),'{n}.id','{n}.name')
);
$editable = $this->Session->read('Schedule.editable');
$request = $this->Session->read('Schedule.request');
?>
<span class='no_print'>
<?=$javascript->link(array('functions','dropdowntabs'));?>
<?=$html->css("dialog") ?>
<? $scheduleName = $this->Session->read('Schedule.name');?>
<? $userName = Inflector::humanize(Authsome::get('username')); ?>
<? $gaps = isset($person['Person']) ? false : true;?>
<nobr>
<?=$role->menu(array(
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
			'Notepad' => array(
				'url' => array('controller' => 'users', 'action' => 'notes'),
				'shortcut' => 'ctrl+n'
			),
			'Email Users...' => array(
				'url' => array('controller' => 'users', 'action' => 'emailUsers'),
				'ajax',
				'shortcut' => 'ctrl+e'
			),
			"<hr/>",
			'View Request...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'viewRequest'),
				'ajax',
				'hidden' => $request,
				'shortcut' => 'shift+ctrl+r'
			),
			'Delete Requests...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'deletePublishedRequest'),
				'ajax',
				'hidden' => $request
			),
			array(
				'title' => "<hr/>",
				'hidden' => $request
			),
			'Operations Email Settings...' => array(
				'url' => array('controller' => 'EmailAuths', 'action' => 'operations'),
				'ajax'
			),
			'Scheduler Email Settings...' => array(
				'url' => array('controller' => 'EmailAuths', 'action' => 'scheduler'),
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
		'sub' => $managerMenu // from app_controller
	),
	array(
		'role' => array('manager','operations','personnel'),
		'title' => ' | '
	),
	'Schedules' => array(
		'role' => array('operations','manager'),
		'url' => array('controller' => 'schedules', 'action' => 'select'),
		'ajax',
		'hidden' => !$isOperations && !$request,
		'sub' => array(
			'In Progress...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'select'),
				'ajax',
				'shortcut' => 'ctrl+i',
				'hidden' => $request
			),
			'Published...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'published'),
				'ajax',
				'shortcut' => 'ctrl+o'
			),
			array(
				'title' => "<hr/>",
				'hidden' => $request
			),
			'View Gaps' => array(
				'url' => array('controller' => 'people', 'action' => 'schedule','gaps'),
				'shortcut' => 'ctrl+g',
				'hidden' => $request
			),
			array('hidden'=>!$editable,'title'=>"<hr/>"),
			'Edit Days...' => array(
				'url' => array('controller' => 'days', 'action' => 'edit'),
				'hidden' => !$editable,
				'ajax'
			),
			'Edit Times...' => array(
				'url' => array('controller' => 'boundaries', 'action' => 'edit'),
				'hidden' => !$editable,
				'ajax'
			),
			array(
				'title' => "<hr/>",
				'hidden' => $request
			),
			'Edit a Copy...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'copy'),
				'ajax',
				'shortcut' => 'shift+ctrl+n',
				'hidden' => $request
			),
			'Delete...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'delete'),
				'ajax',
				'shortcut' => 'shift+ctrl+d',
				'hidden' => $request
			),
			'Merge...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'merge'),
				'ajax',
				'hidden' => !$editable || $request,
			),
			array(
				'title' => "<hr/>",
				'hidden' => $request
			),
			'New From Template...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'copyTemplate'),
				'ajax',
				'hidden' => $request
			),
			'Save as Template...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'template'),
				'ajax',
				'hidden' => $request
			),
			'Delete Template...' => array(
				'url' => array('controller' => 'schedules', 'action' => 'deleteTemplate'),
				'ajax',
				'hidden' => $request
			),
			array(
				'title' => "<hr/>",
				'role' => array('operations'),
				'hidden' => $request
			),
			$show_dates? 'Hide Dates' : 'Show Dates' => array(
				'url' => array('controller' => 'settings', 'action' => 'toggleDates'),
				'role' => array('operations'),
				'hidden' => $request
			),
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
		'hidden' => $request,
		'sub' => array(
			'role' => array('operations'),
			'View Schedule...' => array(
				'hidden' => !$editable,
				'url' => array('controller' => 'people', 'action' => 'schedule'),
				'ajax',
				'shortcut' => 'ctrl+p'
			),
			'Big Board' => array(
				'url' => array('controller' => 'people', 'action' => 'board'),
				'shortcut' => 'ctrl+b'
			),
			array('hidden'=>!$editable,'title'=>"<hr/>"),
			'New Person...' => array(
				'hidden' => !$editable,
				'url' => array('controller' => 'people', 'action' => 'add'),
				'ajax',
				'shortcut' => 'shift+ctrl+p'
			),
			array('hidden'=>!$editable,'title'=>"<hr/>"),
			'Restore Person...' => array(
				'hidden' => !$editable,
				'url' => array('controller' => 'people', 'action' => 'restore'),
				'ajax',
				'shortcut' => 'shift+ctrl+s'
			),
			'Retire Person...' => array(
				'hidden' => !$editable,
				'url' => array('controller' => 'people', 'action' => 'retire'),
				'ajax',
				'shortcut' => 'shift+ctrl+t'
			),
			array('hidden'=>!$editable,'title'=>"<hr/>"),
			"New Category..." => array(
				'url' => array(
					'controller' => 'residentCategories',
					'action' => 'add'
				),
				'hidden' => !$editable,
				'ajax'
			),
			"Edit Category..." => array(
				'url' => array(
					'controller' => 'residentCategories',
					'action' => 'edit'
				),
				'hidden' => !$editable,
				'ajax'
			),
			"Reorder Categories..." => array(
				'url' => array(
					'controller' => 'residentCategories',
					'action' => 'reorder'
				),
				'hidden' => !$editable,
				'ajax'
			),
			"Delete Category..." => array(
				'url' => array(
					'controller' => 'residentCategories',
					'action' => 'delete'
				),
				'hidden' => !$editable,
				'ajax'
			),
			array('hidden'=>!$editable,'title'=>"<hr/>"),
			"Affected Schedules..." => array(
				'url' => array(
					'controller' => 'people',
					'action' => 'changed'
				),
				'hidden' => !$editable,
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
		'hidden' => $request,
		'sub' => array(
			'role' => array('operations'),
			'View Schedule...' => array(
				'hidden' => !$editable,
				'url' => array('controller' => 'areas', 'action' => 'select'),
				'ajax',
				'shortcut' => 'ctrl+a'
			),
			array('hidden'=>!$editable,'title'=>"<hr/>"),
			'New Area...' => array(
				'hidden' => !$editable,
				'url' => array('controller' => 'areas', 'action' => 'add'),
				'ajax'
			),
			array('hidden'=>!$editable,'title'=>"<hr/>"),
			'Clear Area...' => array(
				'hidden' => !$editable,
				'url' => array(
					'controller' => 'areas',
					'action' => 'clear',
					(isset($area)) ? $area : null 
				),
				'ajax',
			),
			'Delete Area...' => array(
				'hidden' => !$editable,
				'url' => array(
					'controller' => 'areas',
					'action' => 'delete',
					(isset($area)) ? $area : null 
				),
				'ajax'
			),
			array('hidden'=>!$editable,'title'=>"<hr/>"),
			"Affected Schedules..." => array(
				'url' => array(
					'controller' => 'areas',
					'action' => 'changed'
				),
				'hidden' => !$editable,
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
		'hidden' => !$editable || (!$isOperations && !$request),
		'role' => array('operations','manager'),
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
				'ajax',
				'hidden' => $request
			)
		)
	)
))?>
</nobr>
<? if (!Authsome::get('id')) { ?>
	<?= $ajax->link(
		'Login',
		array('controller'=>'users','action'=>'login'),
		array(
			'id' => 'login',
			'update' => 'dialog_content',
			'complete' => "openDialog('login',true,'bottom')",
			'title' => '(ctrl+l)'
		)
	)?>
	<?= $this->element('shortcut',array(
		'shortcut' => 'ctrl+l',
		'codeBlock' => "clickLink($('login'))"
	));?>
<? } ?>
<? if ($isOperations || $request == 2) { ?>
<?= $this->element('shortcut',array(
	'shortcut' => 'ctrl+u',
	'codeBlock' => "clickLink($('undoLink'))"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'ctrl+r',
	'codeBlock' => "clickLink($('redoLink'))"
));?>
<div class='changes'>
	<? if ($editable || $request == 2) { ?>
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
