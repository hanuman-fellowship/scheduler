<?
class DialogHelper extends AppHelper {
	
	var $helpers = array('javascript');

	function reload($url,$first_field) {
		if ($url) {
			return $this->javascript->codeBlock("window.location.href='{$url}'");
		} else {
			return $this->javascript->codeBlock("
				$('dialog').style.zIndex=1001;
				$('{$first_field}').select();
				$('{$first_field}').focus();
			");
		}
	}
}
?>	
