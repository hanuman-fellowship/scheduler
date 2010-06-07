<?
class ScheduleHelper extends AppHelper {

	var $legend = array();
	var $total_hours = array(
		'total'=>0,'1'=>0,'2'=>0,'3'=>0,'4'=>0,'5'=>0,'6'=>0,'7'=>0);
	var $helpers = array('html','text','role');
		
	function displayPersonShift($shift,$bound,$day) {
		// if the shift is within the bounds for this day and time
		if ($shift['start'] >= $bound['start'] && $shift['start'] < $bound['end'] && $shift['day_id'] == $day) {
			$link_title = $shift['Area']['short_name'];
			$link_url = array('controller'=>'areas','action'=>'schedule',$shift['Area']['id']);
			$time = $this->displayTime($shift['start']) . " - " . 
				$this->displayTime($shift['end']);
		
			$length = $this->timeToHours($shift['end']) - $this->timeToHours($shift['start']);
			$this->total_hours[$day] += $length;
			$this->total_hours['total'] += $length;
			
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
	if (isset($link_title)) return "<b>" . $this->html->link($link_title, $link_url) . "</b> " . $time . "<br/>";
	}

	function displayAreaShift($shift,$bound,$day) {
		// if the shift is within the bounds for this day and time
		if ($shift['start'] >= $bound['start'] && $shift['start'] < $bound['end'] && $shift['day_id'] == $day) {
			$time = $this->displayTime($shift['start']) . " - " . 
				$this->displayTime($shift['end']);
			$people = '';
			$people_displayed = 0;
			foreach ($shift['Assignment'] as $assignment) {
				$people_displayed++;
				$link_title = $assignment['Person']['name'];
				$link_url = array('controller'=>'people','action'=>'schedule',$assignment['Person']['id']);
			
				$length = $this->timeToHours($shift['end']) - $this->timeToHours($shift['start']);
				$this->total_hours[$day] += $length;
				$this->total_hours['total'] += $length;
				
				$people .= '<br/>' . $this->html->link($link_title, $link_url, array('class' => 'RC_' . $assignment['Person']['resident_category_id']));
				
			}
			for ($i = $people_displayed; $i < $shift['num_people']; $i++) {
				$unassigned = $this->role->link('________',array(
					'operations' => array('controller'=>'assignments','action'=>'assign',$shift['id'])
				));
				$people .= "<br/>{$unassigned}";
			}
		}
		if (isset($time)) {
			$time = $this->role->link($time,array(
				'operations' => array('controller'=>'shifts','action'=>'edit',$shift['id'])
			));
			return "<b>" . $time . "</b> " . $people . "<br/><br/><br/>";
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
				return 'class="dayoff_bg"';
			}
		}
	}
	
	function displayPersonFloating($floating_shifts) {
		$output = array();
		foreach ($floating_shifts as $floating_shift) {
			$hours = $floating_shift['hours'];
			$this->total_hours['total'] += $hours;
			$hours = ($hours == 1) ? 
				"$hours hour" :
				"$hours hours ";
			$link_title = $floating_shift['Area']['name'];
			$link_url = array('controller'=>'areas','action'=>'schedule',$floating_shift['Area']['id']);
			$note = $floating_shift['note'];
			
			// need to make sure floating shifts are in the legend as well.
			// replace spaces with &nbsp; so that line breaks are not in the middle of something
			if (!isset($this->legend[$floating_shift['Area']['id']])) {
				$this->legend[$floating_shift['Area']['id']]['short_name'] = 
					str_replace(' ', '&nbsp;', $floating_shift['Area']['short_name']);
				$this->legend[$floating_shift['Area']['id']]['name'] = 
					str_replace(' ', '&nbsp;', $floating_shift['Area']['name']);
				$this->legend[$floating_shift['Area']['id']]['manager'] = 
					str_replace(' ', '&nbsp;', $floating_shift['Area']['manager']);
			}
			$output[] = $hours . $this->html->link($link_title, $link_url) . " " . $note;
			
		}
		return (!$output ? '' : 'Plus ' . $this->text->toList($output));	
	}
	
	function displayAreaFloating($floating_shifts) {
		$output = array();
		foreach($floating_shifts as $floating_shift) {
			$hours = $floating_shift['hours'];
			$this->total_hours['total'] += $hours;
			$hours = ($hours == 1) ? 
				"$hours hour" :
				"$hours hours ";
			$link_title = $floating_shift['Person']['name'];
			$link_url = array('controller'=>'people','action'=>'schedule',$floating_shift['Person']['id']);
			$note = $floating_shift['note'];
			$output[] = $hours . "w/ " . $this->html->link(
				$link_title, $link_url, array(
					'class' => 'RC_' . $floating_shift['Person']['resident_category_id']
				)
			) . " " . $note;
		}	
		return (!$output ? '' : 'Also ' . $this->text->toList($output));	
	}
	
	// this to be called after all shifts have been displayed so that $this->legend is accurate
	function displayLegend() {
		$output = '';
		foreach($this->legend as $legend) {
			$output .= 
			"<strong>{$legend['short_name']}</strong>&nbsp;=&nbsp;{$legend['name']}&nbsp;({$legend['manager']}) ";
		}
		return $output;
	}
}
?>