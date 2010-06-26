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
		$menuData .= '<div>';
		$menuData .= '<ul class="menu">';
		foreach($data[$cur_role] as $title => $top) {
			$menuData .= '<li class="top">';
			if (!is_array($top)) {
				$menuData .= "<span>{$top}</span>";
			} else {
				if (isset($top['url'])) {
					$menuData .= $this->html->link("{$title}",$top['url'],array(
						'class'=>'top_link'
					));
				} else {
					$menuData .= $title;
				}
				if (isset($top['sub'])) {
					$menuData .= '<ul class="sub">';
					foreach($top['sub'] as $title => $sub) {
						$menuData .= '<li>';
						if ($sub == '') {
							$menuData .= "<span>{$title}</span>";
						} else {
							
							$menuData .= $this->html->link($title,$sub);
						}
						$menuData .= '</li>';
					}
					$menuData .= '</ul>';
				}
			}
			$menuData .= '</li>';
			
		}
		$menuData .= '</ul>';
		$menuData .= '</div>';
		return $menuData;
	}
	
}
?>