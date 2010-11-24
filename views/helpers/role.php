<?
class RoleHelper extends AppHelper {

	var $helpers = array('html','ajax','javascript');
	
	function link($title,$roles,$override = false) {
		$userRoles = Set::combine(Authsome::get('Role'),'{n}.id','{n}.name');
		if($userRoles == array()) $userRoles[] = '';
		$userRoles = ($override === true) ? array('') : (($override === false) ? $userRoles : array($override));
		if ($availRoles = array_intersect($userRoles,array_keys($roles))) {
			$thisRole = reset($availRoles);
			$attributes = array_key_exists('attributes',$roles[$thisRole]) ? 
				$roles[$thisRole]['attributes'] : null;
			$url =  $roles[$thisRole]['url'];
			$type = in_array('ajax',$roles[$thisRole]) ?
				'ajax' : 'html';
			return $url ? 
				$this->{$type}->link($title,$url,$attributes) : 
				$this->html->tag('span',$title,$attributes);
		} else {
			return $title;
		}
	}
	
	function menu($data) {
		$View =& ClassRegistry::getObject('view'); 
		$userRoles = Set::combine(Authsome::get('Role'),'{n}.id','{n}.name');
		if($userRoles == array()) $userRoles[] = '';
		$menuData = $this->html->css("menu");
		$subMenus = array();
		$menuNum = 0;
		$menuData .= "<div id='menu' class='top'>";
		$menuData .= '<ul>';
		foreach($data as $title => $top) {
			$menuNum++;
			if (!is_array($top)) { // no link, role, or submenus so draw it and move on
				$menuData .= '<li>';
				$menuData .= "<span>{$top}</span>";
				$menuData .= '</li>';
				continue;
			}
			if (array_key_exists('title',$top)) {
				$title = $top['title'];
			}
			if (array_key_exists('role',$top)) {
				if (!array_intersect($userRoles,$top['role'])) { // skip this one if it's not our role
					continue;
				}
			} 
			if (array_key_exists('hidden',$top)) {
				if ($top['hidden']) {
					continue;
				}
			}
			$menuData .= '<li>';			
			if (isset($top['url'])) {
				$attributes = array(
					'id'=>"menu_{$title}",
					'rel'=>"sub{$menuNum}"
				);
				if (in_array('ajax',$top)) {
					$type = 'ajax';
					$attributes = array_merge($attributes,array(
						'update' => 'dialog_content',
						'complete' => "openDialog('menu_{$title}',true,'bottom')"
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
					if (!array_intersect($userRoles,$top['sub']['role'])) { // skip the submenu if it's not our role
						$showSub = false;
					}
					unset($top['sub']['role']);
				}
				if (array_key_exists('hidden',$top['sub'])) {
					if ($top['sub']['hidden']) { // skip the submenu if it's hidden
						$showSub = false;
					}
					unset($top['sub']['hidden']);
				}
				if ($showSub) {
					$subMenus[$menuNum] = "<div id='sub{$menuNum}' class='sub'>";
					$i = 0;
					foreach($top['sub'] as $sub_title => $sub) {
						if (!is_array($sub)) { // no link or role, so draw and move on
							$subMenus[$menuNum] .= "<span>{$sub}</span>";
							continue;
						}
						$sub_title = array_key_exists('title',$sub) ? $sub['title'] : $sub_title;
						if (array_key_exists('role',$sub)) {
							if (!array_intersect($userRoles,$sub['role'])) { // skip this one if it's not our role
								continue;
							}
						} 
						if (array_key_exists('hidden',$sub)) {
							if ($sub['hidden']) {
								continue;
							}
						}
						if (array_key_exists('shortcut',$sub)) {
							echo $View->element('shortcut',array(
								'shortcut' => $sub['shortcut'],
								'codeBlock' => "clickLink($('sub{$menuNum}').down('a',{$i}))"
							));
							$subMenus[$menuNum] .= "<span class='shortcut'>{$sub['shortcut']}</span>";
						}
						$i++;
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
								}
							}				
							$confirm = array_key_exists('confirm',$sub) ? $sub['confirm'] : null;
							$subMenus[$menuNum] .= $this->{$type}->link($sub_title,$sub['url'],$attributes,$confirm);
						} else {
							$subMenus[$menuNum] .= "<span>{$sub_title}</span>";
						}
					}
					$subMenus[$menuNum] .= '</div>';
				}
			}
			$menuData .= '</li>';
		}
		$menuData .= '</ul>';
		$menuData .= '</div>';
		foreach($subMenus as $subMenu) {
			$menuData .= $subMenu;
		}
		$menuData .= $this->javascript->codeBlock("tabdropdown.init('menu')");
		return $menuData;
	}
	
}
?>
