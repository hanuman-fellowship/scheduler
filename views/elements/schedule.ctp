<?=$javascript->link('functions');?>
<?=$html->css("dialog") ?>
<?=$role->menu(array(
	'' => array(
		'Login' => array(
			'url' => array('controller' => 'users', 'action' => 'login'),
			'ajax' => array(
				'update'=>'dialog_content',
				'complete'=>"openDialog('menu_Login','#FFF','true')",
				'id' => 'menu_Login'
			)
		)
	),
	'operations' => array(
		"Hello, ".Inflector::humanize(Authsome::get('username')),
		'Logout' => array(
			'url' => array('controller' => 'users', 'action' => 'logout')
		),
		' | ',
		'New' => array(
			'url' => '#',
			'sub' => array(
				'Area' => array(
					'url' => array('controller' => 'areas', 'action' => 'add')
				),
				'<hr/>',
				'Person' => array(
					'url' => array('controller' => 'people', 'action' => 'add')
				),
				'Shift' => array(
					'url' => array('controller' => 'shifts', 'action' => 'add'),
					'ajax' => array(
						'update'=>'dialog_content',
						'complete'=>"openDialog('menu_Shift','#FFF','true')",
						'id' => 'menu_Shift'
					)
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
