<?
class RoleHelper extends AppHelper {

	var $helpers = array('html','ajax');
	
	function wrap($content, $roles) {
		foreach ($roles as $role => $wrapper) {
			if (Authsome::get('role') == $role) {
				return ($wrapper[0] . $content . $wrapper[1]);
			}
		}
	}
	
	function link($title,$roles,$override = false) {
		$cur_role = ($override) ? '' :  Authsome::get('role');
		if (array_key_exists($cur_role,$roles)) {
			$attributes = array_key_exists('attributes',$roles[$cur_role]) ? 
				$roles[$cur_role]['attributes'] : null;
			$url =  $roles[$cur_role]['url'];
			$type = in_array('ajax',$roles[$cur_role]) ?
				'ajax' : 'html';
			return $this->{$type}->link($title,$url,$attributes);
		} else {
			return $title;
		}
	}
	
	function menu($data) {
		$cur_role = Authsome::get('role');
		$menuData = $this->html->css("menu");
		$menuData .= '<span>';
		$menuData .= '<ul class="menu">';
		foreach($data as $title => $top) {
			if (!is_array($top)) { // no link, role, or submenus so draw it and move on
				$menuData .= '<li class="top">';
				$menuData .= "<span>{$top}</span>";
				$menuData .= '</li>';
				continue;
			}
			if (array_key_exists('title',$top)) {
				$title = $top['title'];
			}
			if (array_key_exists('role',$top)) {
				if (!in_array($cur_role,$top['role'])) { // skip this one if it's not our role
					continue;
				}
			} // if there's no role, specification, then we can display it
			$menuData .= '<li class="top">';			
			if (isset($top['url'])) {
				$attributes = array(
					'class'=>'top_link',
					'onmouseover' => "showElement('menu_{$title}_sub')",
					'id'=>"menu_{$title}"
				);
				if (in_array('ajax',$top)) {
					$type = 'ajax';
					$attributes = array_merge($attributes,array(
						'update' => 'dialog_content',
						'complete' => "openDialog('menu_{$title}',false,'bottom')"
					));
				} else {
					$type = 'html';
				}				
				$menuData .= $this->{$type}->link($title,$top['url'],$attributes);
			} else {
				$menuData .= "<span>{$title}</span>";
			}
			if (isset($top['sub'])) {
				$showSub = true;
				if (array_key_exists('role',$top['sub'])) {
					if (!in_array($cur_role,$top['sub']['role'])) { // skip the submenu if it's not our role
						$showSub = false;
					}
					unset($top['sub']['role']);
				}
				if ($showSub) {
					$menuData .= "<ul class='sub' id='menu_{$title}_sub'>";
					foreach($top['sub'] as $sub_title => $sub) {
						if (!is_array($sub)) { // no link or role, so draw and move on
							$menuData .= '<li>';
							$menuData .= "<span>{$sub}</span>";
							$menuData .= '</li>';					
							continue;
						}
						if (array_key_exists('role',$sub)) {
							if (!in_array($cur_role,$sub['role'])) { // skip this one if it's not our role
								continue;
							}
						} // if there's no role, specification, then we can display it
						$menuData .= '<li>';
						if (array_key_exists('url',$sub)) {
							if (array_key_exists('ajax',$sub)) {
								$type = 'ajax';
								$attributes = $sub['ajax'];
							} else {
								if (in_array('ajax',$sub)) {
									$type = 'ajax';
									$attributes = array(
										'update' => 'dialog_content',
										'complete' => "openDialog('menu_{$title}',true,'bottom')",
									);
								} else {				
									$type = 'html';
									$attributes = null;
								}
							}				
							$confirm = array_key_exists('confirm',$sub) ? $sub['confirm'] : null;
							$menuData .= $this->{$type}->link($sub_title,$sub['url'],$attributes,$confirm);
						} else {
							$menuData .= "<span>{$sub_title}</span>";
						}
						$menuData .= '</li>';
					}
					$menuData .= '</ul>';
				}
			}
			$menuData .= '</li>';
		}
		$menuData .= '</ul>';
		$menuData .= '</span>';
		return $menuData;
	}
	
}
?>
