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
	
	function link($title,$roles) {
		$cur_role = Authsome::get('role');
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
		foreach($data[$cur_role] as $title => $top) {
			$menuData .= '<li class="top">';
			if (!is_array($top)) {
				$menuData .= "<span>{$top}</span>";
			} else {
				if (isset($top['url'])) {
					$attributes = array('class'=>'top_link');
					if (array_key_exists('ajax',$top)) {
						$type = 'ajax';
						$attributes = array_merge($attributes,$top['ajax']);
					} else {
						$type = 'html';
					}				
					$menuData .= $this->{$type}->link($title,$top['url'],$attributes);
				} else {
					$menuData .= $title;
				}
				if (isset($top['sub'])) {
					$menuData .= '<ul class="sub">';
					foreach($top['sub'] as $title => $sub) {
						$menuData .= '<li>';
						if (!is_array($sub)) {
							$menuData .= "<span>{$sub}</span>";
						} else {
							if (array_key_exists('ajax',$sub)) {
								$type = 'ajax';
								$attributes = $sub['ajax'];
							} else {
								$type = 'html';
								$attributes = null;
							}				
							$menuData .= $this->{$type}->link($title,$sub['url'],$attributes);
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