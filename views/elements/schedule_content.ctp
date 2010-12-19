<?
$isPersonnel = in_array(
	'personnel',
	Set::combine(Authsome::get('Role'),'{n}.id','{n}.name')
);
$isOperations = in_array(
	'operations',
	Set::combine(Authsome::get('Role'),'{n}.id','{n}.name')
);
$editable = $this->Session->read('Schedule.editable');
if (isset($area['RequestArea'])) {
	$request = 'Request';
	$editRequest = ($area['RequestArea']['id'] < 0) ? true : false;
} else {
	$request = '';
	$editRequest = false;
	$groupName = $this->session->read('Schedule.Group.name');
}
$gaps = isset($gaps);
$notes = $gaps ? false : (isset($area) ? $area["{$request}Area"]['notes'] : $person['PeopleSchedules']['notes']);
?>
<table  style='' width="774" border="0" align="center" cellpadding="0" cellspacing="0"> 
	<tr> 
		<td width="99" rowspan="2"> 
			<div align="right"> 
				<p>
				<?= (isset($area)) ?
				'Manager: ' :  
				'Total Hours: ';?>
				</p> 
			</div>
		</td> 
		<td width="9" rowspan="2">
			&nbsp;
		</td> 
		<td class="title" <?= (isset($person)) ? 'id="total_hours_'.$person['Person']['id'].'"' : '';?> width="144" rowspan="2">
			<?= (isset($area)) ?
				$area[$request.'Area']['manager'] :
				'';?>
		</td> 
		<td width="222" rowspan="2"> 
			<div align="center" class="title"> 
			<? if (isset($area)) { ?>
				<?= $request ? "<span style='color:#999'>" : '';?>
				<span id='area_name'>
				<?=$role->link(
					$area[$request.'Area']['name'],
					array(
						'operations' => array(
							'url' => array('action'=>'edit',$area[$request.'Area']['id']),
							'attributes'=>array(
								'update'=>'dialog_content',
								'complete'=>"openDialog('area_name')",
								'title' => 'Edit Area...'
							),
							'ajax'
						)
					),
					($this->params['isAjax'] || !$editable || $request)
				);?>
				</span>
			<? } else { ?>
				<?= $person['PeopleSchedules']['ResidentCategory']['name'] ?>
			<? } ?>
				<br />
				<?= $request ? "Request Form" : "Schedule";?>
				<?= $request ? "</span>" : '';?>
			</div>
		</td> 
		<td width="107">
			<div align="right">
			<?= (isset($person) && !$gaps) ? 'Name:' : '';?>
			</div>
		</td> 
		<td width="15">
			&nbsp;
		</td> 
		<td width="178">
			<span style="font-size:24px;"> 
			<? if (isset($person) & !$gaps) { ?>
				<span id='person_name'>
				<?=$role->link(
					$person['Person']['name'],
					array(
						'operations' => array(
							'url' => array('action'=>'edit',$person['Person']['id']),
							'attributes'=>array(
								'update'=>'dialog_content',
								'complete'=>"openDialog('person_name')",
								'title' => 'Edit Person...'
							),
							'ajax'
						)
					),
					($this->params['isAjax'] || !$editable)
				);?>
				</span>
			<? } ?>
			</span>
		</td> 
	</tr> 
	<tr> 
		<td width='200px' colspan='3'> 
			<div align="center">
		<?= isset($groupName) ? 
			$role->link(
				$groupName,
				array(
					'operations' => array(
						'url' => array('controller'=>'schedules','action'=>'change'),
						'attributes'=>array(
							'update'=>'dialog_content',
							'complete'=>"openDialog('effective',false,'bottom')",
							'title' => 'Change date range...',
							'id' => 'effective',
							'escape' => false
						),
						'ajax'
					)
				),
				($this->params['isAjax'] || !$editable || $request)
			)
		: ''?>
			</div>
		</td> 
	</tr> 
</table> 
<table style="<?= $request ? "background-image:url({$html->url('/img/lines.jpg')})" : "";?>" width="774" border="2" align="center" cellpadding="0" cellspacing="0" > 
	<tr> 
		<td width="75" bordercolor="#000000"> 
		<div align='center'>
		<? if (isset($area)) { ?>
			<? if ($request) { ?>
				<?=$html->link('View<br/>Schedule',
					array(
						'controller'=>'areas',
						'action'=>'schedule',
						abs($area['RequestArea']['id'])
					),
					array(
						'escape'=>false,
						'style'=>'color:green'
					)
				); ?>
			<? } elseif ($area['hasRequest'] && $isOperations) { ?>
				<?=$html->link('View<br/>Request',
					array(
						'controller'=>'RequestAreas',
						'action'=>'view',
						$area['Area']['id']
					),
					array(
						'escape'=>false,
						'style'=>'color:green'
					)
				); ?>
			<? } ?>
		<? } ?>
		</div>
		</td> 
<? foreach ($bounds['days'] as $day_id => $day) { ?>
		<td width="75" bordercolor="#000000"> 
			<div align="center"> 
				<p>
				<? if ($isOperations && $editable && isset($person) && !$gaps) { ?>
					<?=$html->link($day,array(
						'controller'=>'off_days',
						'action'=>'toggle',
						$person['Person']['id'],
						$day_id
					),array('title' => 'Toggle Day Off')); ?>
				<? } else { ?>
					<?=$day;?>
				<? } ?>
				</p> 
			</div> 
		</td>
<? } ?>
	</tr>	
	<tr> 
<? foreach ($bounds['slots'] as $slot_num => $slot) { ?>
		<td width="75" height="60" bordercolor="#000000"> 
			<div align="center"> 
				<p><?=$slot?></p> 
			</div> 
		</td> 
	<? foreach ($bounds['days'] as $day => $d) { ?>
		<? $off_day = (isset($person) && !$gaps) ? $schedule->offDays($person['OffDay'], $day) : ''; ?>
		<? if ($isOperations && $editable && !$this->params['isAjax'] && !$request
		|| ($request && $editRequest)) { ?>
		<td <?=$off_day;?> id="<?=$slot_num.'_'.$day?>"
			onmouseover='showAddShift($("add_<?=$slot_num?>_<?=$day?>"))'
			onmouseout='hideAddShift($("add_<?=$slot_num?>_<?=$day?>"))'
		> 
			<? $url = (isset($area)) ? 
				array('controller'=>'shifts','action'=>'add',$area[$request.'Area']['id'],
					$day,
					str_replace(":","-",$bounds['bounds'][$slot_num][$day]['start'])) 
				:
				array('controller'=>'shifts','action'=>'listBySlot',
					!$gaps ? $person['Person']['id'] : '',
					$day,
					str_replace(":","-",$bounds['bounds'][$slot_num][$day]['start']),
					str_replace(":","-",$bounds['bounds'][$slot_num][$day]['end']));
			?>
			<?= !$gaps ? $ajax->link(' + ',$url,array(
				'id'=>"add_{$slot_num}_{$day}", 
				'class' => 'add',
				'update' => 'dialog_content',
				'complete' => "openDialog('{$slot_num}_{$day}')",
				'title' => isset($area) ? 'New Shift...' : 'Assign Shift...'
			)) : '';?>
		<? } else { ?>
		<td <?=$off_day;?> >
		<? } ?>
			<div align="center" class="shift"> 
				<p> 
		<? if (isset($area)) { ?>
			<? foreach ($area[$request.'Shift'] as $shift) { ?>
						<?=$schedule->displayAreaShift($shift,$bounds['bounds'][$slot_num][$day],$day,$editRequest);?>
			<? } ?>
		<? } else { ?>
			<? foreach ($person['Assignment'] as $assignment) { ?>
						<?=$schedule->displayPersonShift($assignment,
							$bounds['bounds'][$slot_num][$day],$day);?>
			<? } ?>		
		<? } ?>
				</p> 
			</div> 
		</td> 
	<? } ?>
	</tr>
<? } ?>
	<tr> 
	<? if (isset($person)) { ?>
		<td height="26" bordercolor="#000000">
			<div align="center">
				Hours
			</div>
		</td> 
	<? foreach ($bounds['days'] as $day => $d) { ?>	 
		<td align="center" height="26" bordercolor="#000000">
			<?=$schedule->total_hours[$day];?>
		</td> 
 	<? } ?>
 	</tr> 
	<tr> 
	<? } ?>	
		<td id="0_0" onmouseover='showAddShift($("add_0_0"))'
			onmouseout='hideAddShift($("add_0_0"))' align="center" height="13" colspan="8" bordercolor="#000000" style="padding:3px;"> 
		<? if (isset($area)) { ?>
			<?=$schedule->displayAreaFloating($area['FloatingShift'],$editRequest);?>
			<? $area_id = $area[$request.'Area']['id']; ?>
			<? $person_id = 0; ?>
		<? } else { ?>
			<?= !$gaps ? $schedule->displayPersonFloating($person['FloatingShift']) : '';?>
			<? $person_id = $gaps ? 0 : $person['Person']['id']; ?>
			<? $area_id = 0; ?>
			<?// now that the total hours are added up, sneak them in at the top
			?>
			<script type="text/javascript">
				$('total_hours_<?=$person['Person']['id']?>').innerHTML = <?=$schedule->total_hours['total'];?>;
			</script>
		<? } ?>
		<? if ($isOperations && $editable && !$request
		|| ($request && $editRequest)) { ?>
			<?= !$gaps ? $ajax->link(
				' + ',
				array('controller'=>'floatingShifts','action'=>'add',$area_id,$person_id),
				array(
					'id'=>"add_0_0", 
					'class' => 'add',
					'update' => 'dialog_content',
					'complete' => "openDialog('0_0',null,'top')",
					'title' => 'New Floating Shift'
				)
			) : '';?>
		<? } ?>
			<br/>
		</td> 
	</tr> 
	<? if (($isOperations && $editable && !$request && !$gaps) || $notes || $editRequest) { ?>
	<tr> 
		<td id="notes" align="center" height="13" colspan="8" bordercolor="#000000" style="padding:3px;">
			<i>
			<?=$role->link(
				$notes ? $notes : '*** notes ***',
				array(
					'operations' => array(
						'url' => array(
							'action'=>'editNotes',
							isset($area)? $area[$request.'Area']['id'] : $person['Person']['id']
						),
						'attributes'=>array(
							'update'=>'dialog_content',
							'complete'=>"openDialog('notes',false,'top')",
							'title' => 'Edit Notes...'
						),
						'ajax'
					)
				),
				$editable && !$request || ($request && $editRequest) ? 'operations' : '' 
			);?>
			</i>
		</td> 
	</tr> 
	<? } ?>	
	<? if (isset($person)) { ?>
	<tr> 
		<td align="center" height="13" colspan="8" bordercolor="#000000" style="padding:3px;">
			<?=$schedule->displayLegend();?>
		</td> 
	</tr> 
	<? } ?>	
</table> 
<? if (!$request && !$gaps && !isset($print)) { ?>
	<table align='center' width='850px' style='font-size:17pt;text-align:center'>
		<tr>
			<td align='left'>
<?
	echo $html->link('&larr;',
		array(
			'action' => 'previous',
			isset($area) ? $area['Area']['id'] : $person['Person']['id']
		),
		array(
			'escape' => false,
			'id' => 'previousSchedule',
			'title' => 'Previous Schedule (shift+left)'
		)
	);
?>
		</td>
		<td align='right'>
<?
	echo $html->link('&rarr;',
		array(
			'action' => 'next',
			isset($area) ? $area['Area']['id'] : $person['Person']['id']
		),
		array(
			'escape' => false,
			'id' => 'nextSchedule',
			'title' => 'Next Schedule (shift+right)'
		)
	);
?>
		</td>
	</tr>
</table>
<? } ?>
<? if (($isPersonnel || $isOperations) && isset($person) && !$gaps && !isset($print)) { ?>
<table align="center" width="774px" style="position:relative;top:-30px">
	<tr>
		<td valign="top" style="font-size:14pt;text-align:left">
		<? if ($isPersonnel) { ?>
		<b><u>
		<?=$role->link("Personnel Notes:", array(
			'personnel' => array(
				'url' => array(
					'controller' => 'PersonnelNotes',
					'action' => 'add',
					$person['Person']['id']
				),
				'attributes' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('pnotes',false,'top')",
					'id' => 'pnotes'
				),
				'ajax'
			)
		));?>
		</b></u>
			<ul id='lpnotes'>
				<? $note_ids = ''?>
				<? foreach($personnelNotes as $id => $note) { ?>
					<? $note_ids .= $id.','?>
					<li id='lpnote_<?=$id?>'>
					<?=$ajax->link('edit',array(
						'controller' => 'PersonnelNotes',
						'action' => 'edit',
						$id
					),array(
						'update' => 'dialog_content',
						'complete' => "openDialog('lpnote_".$id."')",
						'style' => 'display:none',
						'class' => 'edit',
					));?>
					<i>
						<?=$html->tag('span',$note,array(
							'onclick' => $isPersonnel ? "
								if (saveOrder('lpnotes')) 
									clickLink(this.up('li').down('a.edit'));
							" : '',
							'onmouseover' => "this.style.cursor='pointer'",
						))?>
					</i></li>
				<? } ?>	
				<? $note_ids = substr_replace($note_ids,'',-1) ?>
			</ul>
		<? } ?>
		</td>
		<td width="20px"></td>
		<td valign="top" style="font-size:14pt;text-align:left">
			<b><u>
		<? if ($operationsNotes || $isPersonnel) 
		echo $role->link((!$isPersonnel)? "Notes from Personnel:" : "Notes for Operations:", array(
			'personnel' => array(
				'url' => array(
					'controller' => 'OperationsNotes',
					'action' => 'add',
					$person['Person']['id']
				),
				'attributes' => array(
					'update' => 'dialog_content',
					'complete' => "openDialog('onotes',false,'top')",
					'id' => 'onotes'
				),
				'ajax'
			)
		));?>
		</u></b>
			<ul id='lonotes'>
				<? $note_ids = ''?>
				<? foreach($operationsNotes as $id => $note) { ?>
					<? $note_ids .= $id.','?>
					<li id='lonote_<?=$id?>'>
					<?=$ajax->link('edit',array(
						'controller' => 'OperationsNotes',
						'action' => 'edit',
						$id
					),array(
						'update' => 'dialog_content',
						'complete' => "openDialog('lonote_".$id."')",
						'style' => 'display:none',
						'class' => 'edit',
					));?>
					<i>
						<?=$html->tag('span',$note,array(
							'onclick' => $isPersonnel ? "
								if (saveOrder('lonotes')) 
									clickLink(this.up('li').down('a.edit'));
							" : '',
							'onmouseover' => $isPersonnel ? "this.style.cursor='pointer'" : '',
						))?>
					</i></li>
				<? } ?>	
				<? $note_ids = substr_replace($note_ids,'',-1) ?>
			</ul>
		</td>
	</tr>
</table>
	<? if ($isPersonnel) { ?>
		<?=$ajax->sortable('lpnotes')?>
		<?=$ajax->form(array('type' => 'post',
				'options' => array(
						'id' => 'lpnotes_form',
						'model'=>'PersonnelNote',
						'url' => array(
								'controller' => 'personnelNotes',
								'action' => 'reorder'
						)
				)
		));?>
		<?=$form->hidden('lpnotes_order',array('id'=>'lpnotes_order','value'=>$note_ids));?>
		<?=$form->submit('submit',array('id'=>'lpnotes_submit','style'=>'display:none'));?>
		<?=$form->end()?>

		<?=$ajax->sortable('lonotes')?>
		<?=$ajax->form(array('type' => 'post',
				'options' => array(
						'id' => 'lonotes_form',
						'model'=>'OperationsNote',
						'url' => array(
								'controller' => 'OperationsNotes',
								'action' => 'reorder'
						)
				)
		));?>
		<?=$form->hidden('lonotes_order',array('id'=>'lonotes_order','value'=>$note_ids));?>
		<?=$form->submit('submit',array('id'=>'lonotes_submit','style'=>'display:none'));?>
		<?=$form->end()?>
	<? } ?>
<? } ?>
<?$schedule->displayHoursBy()?>
<?$schedule->clearHours()?>
