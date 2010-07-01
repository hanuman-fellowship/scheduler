<?
class DialogHelper extends AppHelper {
	
	var $helpers = array('javascript');

	function reload($url,$first_field) {
		if ($url) {
			return $this->javascript->codeBlock("window.location.href='{$url}'");
		} else {
			return $this->javascript->codeBlock("get('{$first_field}').select()");
		}
	}
}
?>	
