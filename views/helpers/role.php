<?
class RoleHelper extends AppHelper {

	var $helpers = array('html');
	
	function wrap($content, $roles) {
		foreach ($roles as $role => $wrapper) {
			if (Authsome::get('role') == $role) {
				return ($wrapper[0] . $content . $wrapper[1]);
			}
		}
	}
	
	function link($link_title,$roles) {
		$cur_role = Authsome::get('role');
		if (array_key_exists($cur_role,$roles)) {
			return $this->html->link($link_title,$roles[$cur_role]);
		} else {
			return $link_title;
		}
	}
	
}
?>