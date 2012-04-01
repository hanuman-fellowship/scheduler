<?
class ScheduleHelper extends AppHelper {

	var $legend = array();
	var $total_hours = array(
		'unassigned'=>0,'total'=>0,'1'=>0,'2'=>0,'3'=>0,'4'=>0,'5'=>0,'6'=>0,'7'=>0);
	var $hours_by = array();
	var $helpers = array('html','text','role','ajax','session');
		
	function displayPersonShift($assignment,$bound,$day,$board = false) {
		if (isset($assignment['Shift'])) {
			$assignment_id = isset($assignment['assignment_id']) ? $assignment['assignment_id'] : 0;
			$star = isset($assignment['star']) ? $assignment['star'] : 0;
			$gaps = ($assignment_id == 0) ? true : false;
			$shift = $assignment['Shift'];	
			// if the shift is within the bounds for this day and time
			if ($shift['start'] >= $bound['start'] && 
			$shift['start'] < $bound['end'] && 
			$shift['day_id'] == $day) {
				$area_title = $shift['Area']['short_name'];
				$area_url = array('controller'=>'areas','action'=>'schedule',$shift['Area']['id']);
				$time_title = $this->displayTime($shift['start']) . " - " . 
					$this->displayTime($shift['end']);
				$time_url = array('controller'=>'assignments','action'=>'unassign',$assignment_id);

				if ($gaps) {
					if ($shift['num'] > 1) {
						$time_title .= " (x{$shift['num']})";
					}
					$multiplier = $shift['num'];
				} else {
					$multiplier = 1;
				}

				$length = $this->timeToHours($shift['end']) - $this->timeToHours($shift['start']);
				$this->addHours(($length * $multiplier),$day,$shift['Area']['name']);
				/**
				 * Make $legend an array of area ids, each of which is an array (short_name, name, manager)
				 * for displaying the key (legend) at the bottom. Only one key needs to be made for each
				 * area that is on this schedule, thus the "if !isset"
				 */
				if (!isset($this->legend[$shift['Area']['id']])) {
					$this->legend[$shift['Area']['id']]['short_name'] = 
						str_replace(' ', '&nbsp;', $shift['Area']['short_name']);
					$this->legend[$shift['Area']['id']]['name'] = 
						str_replace(' ', '&nbsp;', $shift['Area']['name']);
					$this->legend[$shift['Area']['id']]['manager'] = 
						str_replace(' ', '&nbsp;', $shift['Area']['manager']);
				}
			}
			if (isset($area_title)) {
				if ($gaps) {
					$attributes = array(
						'update' => 'dialog_content',
						'complete' => "openDialog('{$shift['id']}')",
						'id' => $shift['id'],
						'title' => 'Assign Shift'
					);
					$time_url = array('controller' => 'assignments', 'action' => 'assign', $shift['id']);
					$ajax = 'ajax';
				} else {
					$attributes = array(
						'class' => 'remove',
						'title' => 'Unassign'
					);
					$ajax = '';
				}
				$output = $star? $this->html->tag('span','*',array('class'=>'star_p')) : '';
				$output .= "<b>" . $this->html->link($area_title, $area_url,
					array('title'=>"View {$shift['Area']['name']} Schedule")) . "</b> ";
				$output .= $this->role->link(
					$time_title,
					array(
						'operations' => array(
							'url' => $time_url,
							'attributes' => $attributes,
							$ajax
						)
					),
					!$this->session->read('Schedule.editable') || $board
				) . "<br/>";
				return "<span class='shift'>{$output}</span>";
			}
		}
		if (isset($assignment['ConstantShift'])) {
			$shift = $assignment['ConstantShift'];
			// if the shift is within the bounds for this day and time
			if ($shift['start'] >= $bound['start'] && 
			$shift['start'] < $bound['end'] && 
			$shift['day_id'] == $day) {
				$title = "<b>{$shift['name']}</b><br>".
					$this->displayTime($shift['start']) . " - " . $this->displayTime($shift['end']);
				$url = array('controller'=>'constant_shifts','action'=>'edit',$shift['id']);
				$length = ($shift['specify_hours']) ? 
					$shift['hours'] :
					$this->timeToHours($shift['end']) - $this->timeToHours($shift['start']);
				$this->addHours($length,$day,$shift['name']);
				$output = "<span class='const'>".$this->role->link(
					$title,
					array(
						'operations' => array(
							'url' => $url,
							'attributes' => array(
								'escape' => false,
								'update'=>'dialog_content',
								'complete'=>"openDialog('constant_{$shift['id']}')",
								'title' => 'Edit Constant Shift...'
							),
							'ajax'
						)
					),
					!$this->session->read('Schedule.editable') || $board
				) . "</span><br/>";
				return "<span id='constant_{$shift['id']}'>{$output}</span>";
			}
		}
	}

	function displayAreaShift($shift,$bound,$day,$request) {
		// if the shift is within the bounds for this day and time
		if ($shift['start'] >= $bound['start'] && $shift['start'] < $bound['end'] && $shift['day_id'] == $day) {
			$time = $this->displayTime($shift['start']) . " - " . 
				$this->displayTime($shift['end']);
			$people = '';
			$people_displayed = 0;
			$length = $this->timeToHours($shift['end']) - $this->timeToHours($shift['start']);
			foreach ($shift['Assignment'] as $assignment) {
				$people_displayed++;
				$this->addHours($length,$day,$assignment['Person']['name']);
				
				$userRoles = Set::combine(Authsome::get('Role'),'{n}.id','{n}.name');
				if (in_array('operations',$userRoles) && $this->session->read('Schedule.editable')) {
					$people .= $this->html->tag('span', null, array(
						'style'=>"position:relative",
						'onmouseover' => "assignHover('{$assignment['Assignment']['id']}','over')",
						'onmouseout' => "assignHover('{$assignment['Assignment']['id']}','out')",
						'class' => 'assignment'
					));
				} else {
					$people .= $this->html->tag('span', null, array(
						'style'=>"position:relative",
						'class' => 'assignment'
					));
				}
				$people .= $this->role->link('*',
					array(
						'' => array(
							'url' => null,
							'attributes' => array(
								'class' => 'star',
								'style' => $assignment['Assignment']['star'] ? '' : 'display:none',
							)
						),
						'operations' => array(
							'url' => array(
								'controller' => 'assignments',
								'action' => 'star',
								$assignment['Assignment']['id']
							),
							'attributes' => array(
								'class' => 'star',
								'style' => $assignment['Assignment']['star'] ? '' : 'display:none;color:#CCC',
								'onclick' => 'saveScroll()',
								'id' => "star_{$assignment['Assignment']['id']}"
							)
						)
					),
					$this->session->read('Schedule.editable') && !$request
					|| ($request == 2) ? 'operations' : '' 
				);
				$people .= $this->role->link(
					$assignment['Person']['name'],
					array(
						'' =>  array( 
							'url' => ($assignment['Person']['id'] == 0) ? null : array(
								'controller'=>'people','action'=>'schedule',$assignment['Person']['id']
							),
							'attributes' => array(
								'style' => $assignment['Person']['id'] == 0 ?
									"color:#000;font-style:italic" :
									"color:".$assignment['PeopleSchedules']['ResidentCategory']['color'],
								'title' => "View {$assignment['Person']['name']}'s Schedule"
							)
						),
						'operations' => array(
							'url' => array(
								'controller'=>'assignments',
								'action'=>'unassign',
								$assignment['Assignment']['id']
							),
							'attributes' => array(
								'class' => 'remove',
								'style' => $assignment['Person']['id'] == 0 ?
								'margin:10px;color:#000;font-style:italic' :
								'margin:10px;color:'.$assignment['PeopleSchedules']['ResidentCategory']['color'],
								'onmouseover' => "assignHover('{$assignment['Assignment']['id']}','over')",
								'onmouseout' => "assignHover('{$assignment['Assignment']['id']}','out')",
								'onclick' => 'saveScroll()',
								'title' => 'Unassign'
							)
						)
					),
					$this->session->read('Schedule.editable') && !$request
					|| ($request == 2) ? 'operations' : '' 
				);
				$people .= '<br/>';
				if (in_array('operations',$userRoles) && !$request && 
				$this->session->read('Schedule.editable') && $assignment['Person']['id'] != 0
				|| ($request == 2)) {
					$people .= $this->html->link('(view)',
						array('controller'=>'people','action'=>'schedule',$assignment['Person']['id']),
						array(
							'style'=>
								'display:none;
								position:absolute;
								top:0;
								right:-3.0em;
								background-color:#DDDDDD;
								padding:5px',
							'id'=>"view_{$assignment['Assignment']['id']}"
						)
					);
				}
				$people .= "</span>";

				
			}
			for ($i = $people_displayed; $i < $shift['num_people']; $i++) {
				$this->total_hours['unassigned']+= $length;
				$unassigned = "<span class='assignment'>".$this->role->link(
					'________',
					array(
						'operations' => array(
							'url' => array('controller'=>'assignments','action'=>'assign',$shift['id']),
							'attributes'=>array(
								'update'=>'dialog_content',
								'complete'=>"openDialog('{$shift['id']}')",
								'title' => 'Assign...',
								'class' => 'assign'
							),
							'ajax'
						)
					),
					$this->session->read('Schedule.editable') && !$request
					|| ($request == 2) ? 'operations' : '' 
				)."</span>";
				$people .= "{$unassigned}<br/>";
			}
		}
		if (isset($time)) {
			$time = $this->role->link(
				$time,
				array(
					'operations' => array(
						'url' => array('controller'=>'shifts','action'=>'edit',$shift['id']),
						'attributes'=>array(
							'update'=>'dialog_content',
							'complete'=>"openDialog('{$shift['id']}')",
							'title' => 'Edit Shift...',
							'class' => 'time'
						),
						'ajax'
					)
				),
				$this->session->read('Schedule.editable') && !$request
				|| ($request == 2) ? 'operations' : '' 
			);
			if (($request == 2) || $this->session->read('Schedule.editable') && !$request) {
				$time .= $this->html->link(
					'delete',
					array('controller'=>'shifts','action'=>'delete',$shift['id']),
					array('style' => 'display:none')
				);
			}
			return "<span id='{$shift['id']}'><b>" .
				$time . "</b><br/>" . $people . "</span><br/><br/>";
		}
	}
	
	function displayTime($time) {
		$time = strtotime($time);
		$hours = date('g', $time);
		$minutes = date('i', $time);
		$minutes = ($minutes == '00') ? "" : ":" . $minutes;
		return $hours . $minutes;
	}	

	function timeToHours($time) {
		$time = strtotime($time);
 		$hour = date('G', $time);
 		$decimal = (date('i', $time) / 60);
 		return $hour + $decimal;
	}
	
	function offDays($off_days,$day) {
		foreach ($off_days as $off_day) {
			if ($off_day['day_id'] == $day) {
				return array(
					'screen' => 'class="dayoff_bg"',
					'print' => '<span class="dayoff_x">X</span>'
				);
			}
		}
	}
	
	function displayPersonFloating($floating_shifts,$board = false) {
		$output = array();
		foreach ($floating_shifts as $floating_shift) {
			$hours = $floating_shift['hours'];
			$areaName = $floating_shift['Area']?
				$floating_shift['Area']['name'] :
				'Other';
			$this->addHours($hours,null,$areaName);
			$hours = ($hours == 1) ? 
				"$hours hour " :
				"$hours hours ";
			$hours = $this->role->link(
				$hours,
				array(
					'operations' => array(
						'url' => array('controller' => 'floating_shifts', 'action' => 'edit', $floating_shift['id']),
						'attributes' => array(
							'update' => 'dialog_content',
							'complete' => "openDialog('floating_{$floating_shift['id']}',false,'top')",
							'title' => 'Edit Floating Shift...'
						),
						'ajax'
					)
				),
				!$this->session->read('Schedule.editable') || $board
			);
			$link_title = $floating_shift['Area'] ? $floating_shift['Area']['short_name'] : '';
			$link_url = $floating_shift['Area'] ? 
				array('controller'=>'areas','action'=>'schedule',$floating_shift['Area']['id']) :
				array();
			$note = " ({$floating_shift['note']})";
			$note = ($note == ' ()') ? ' ' : $note;
			
			// need to make sure floating shifts are in the legend as well.
			// replace spaces with &nbsp; so that line breaks are not in the middle of something
			if ($floating_shift['Area']) {
				if (!isset($this->legend[$floating_shift['Area']['id']])) {
					$this->legend[$floating_shift['Area']['id']]['short_name'] = 
						str_replace(' ', '&nbsp;', $floating_shift['Area']['short_name']);
					$this->legend[$floating_shift['Area']['id']]['name'] = 
						str_replace(' ', '&nbsp;', $floating_shift['Area']['name']);
					$this->legend[$floating_shift['Area']['id']]['manager'] = 
						str_replace(' ', '&nbsp;', $floating_shift['Area']['manager']);
				}
			}
			$output[] = "<span id='floating_".$floating_shift['id']."'>"
			. $hours . $this->html->link($link_title, $link_url,
				array(
					'title' => $floating_shift['area_id'] != 0 ?
						"View {$floating_shift['Area']['name']} Schedule"
						: '',
					'style' => 'font-weight:bold'
				)
			) . $note . '</span>';
			
		}
		return (!$output ? '' : 'Plus ' . $this->text->toList($output));	
	}
	
	function displayAreaFloating($floating_shifts,$request) {
		$output = array();
		foreach($floating_shifts as $floating_shift) {
			$hours = $floating_shift['hours'];
			$this->addHours($hours,null,$floating_shift['Person']['name']);
			$hours = ($hours == 1) ? 
				"$hours hour" :
				"$hours hours ";
			$hours = $this->role->link(
				$hours,
				array(
					'operations' => array(
						'url' => array('controller' => 'floating_shifts', 'action' => 'edit', $floating_shift['id']),
						'attributes' => array(
							'update' => 'dialog_content',
							'complete' => "openDialog('floating_{$floating_shift['id']}',false,'top')",
							'title' => 'Edit Floating Shift...'
						),
						'ajax'
					)
				),
				$this->session->read('Schedule.editable') && !$request
				|| ($request == 2) ? 'operations' : '' 
			);
			$link_title = $floating_shift['Person']['name'];
			$link_url = array('controller'=>'people','action'=>'schedule',$floating_shift['Person']['id']);
			$note = " ({$floating_shift['note']})";
			$note = ($note == ' ()') ? ' ' : $note;
			$output[] = "<span id='floating_".$floating_shift['id']."'>"
			. $hours . " w/ " . $this->html->link(
				$link_title, $link_url, array(
					'style' => "color:{$floating_shift['Person']['PeopleSchedules']['ResidentCategory']['color']}",
					'title' => "View {$floating_shift['Person']['name']}'s Schedule"
				)
			) . $note . '</span>';
		}	
		return (!$output ? '' : 'Also ' . $this->text->toList($output));	
	}

	// this to be called after all shifts have been displayed so that $this->legend is accurate
	function displayLegend() {
		$output = '';
		// Set::sort() needs the ids to be consecutive, so we have to make a new array
		$this->legend = Set::sort(array_values($this->legend),'{n}.short_name','asc');
		foreach($this->legend as $legend) {
			$output .= 
			"<strong>{$legend['short_name']}</strong>&nbsp;=&nbsp;{$legend['name']}&nbsp;({$legend['manager']}) ";
		}
		return $output;
	}

	function displayEffective($schedule, $withTimes = false) {
		$start = strtotime($schedule['start']);
		$end = strtotime($schedule['end']);
		$startYear = date('Y',$start);
		$endYear = date('Y',$end);

		$output = date('M j',$start);
		$output .= $withTimes? date(' @ g:ia', $start) : '';
		$output .= ($startYear == $endYear) ?  '' : date(', Y',$start);
		$output .= ' &ndash; ';
		$output .= $withTimes? date('M j @ g:ia, Y',$end) : date('M j, Y',$end);

		return $output;
	}

	function addHours($hours,$day,$name) {
		if (!array_key_exists($name,$this->hours_by))
			$this->hours_by[$name] = 0;
		$this->hours_by[$name] += $hours;
		if ($day) $this->total_hours[$day] += $hours;
		$this->total_hours['total'] += $hours;
	}

	function displayTotalArea() {
		return "Total Hours: " . $this->total_hours['total'] . " of " .
			($this->total_hours['total'] + $this->total_hours['unassigned']);
	}

	function displayHoursBy() {
		ksort($this->hours_by);
		arsort($this->hours_by);
		$View =& ClassRegistry::getObject('view');
		echo $View->element('hours_by',array('data'=>$this->hours_by,'total'=>$this->total_hours['total']));
	}

	function clearHours() {
		$this->total_hours = array(
			'total'=>0,'1'=>0,'2'=>0,'3'=>0,'4'=>0,'5'=>0,'6'=>0,'7'=>0);
		$this->hours_by = array();
	}

}
?>
