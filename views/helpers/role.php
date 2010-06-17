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
	
	function link($title,$roles,$type = 'html') {
		$cur_role = Authsome::get('role');
		if (array_key_exists($cur_role,$roles)) {
			$attributes = array_key_exists('attributes',$roles[$cur_role]) ? 
				$roles[$cur_role]['attributes'] : null;
			$url =  $roles[$cur_role]['url'];
			return $this->{$type}->link($title,$url,$attributes);
		} else {
			return $title;
		}
	}
	
}
?>