<link href="/app/webroot/css/uploadify.css" type="text/css" rel="stylesheet" /> 
<script type="text/javascript" src="/app/webroot/files/uploadify/swfobject.js"></script> 
<script type="text/javascript" src="/app/webroot/js/jquery.js"></script> 
<script type="text/javascript" src="/app/webroot/js/jquery.uploadify.v2.1.4.min.js"></script> 
<script type="text/javascript"> 
var $j = jQuery.noConflict();
$(document).ready(function() {
	$j('#image_upload').uploadify({
		'uploader'   : '/app/webroot/files/uploadify/uploadify.swf',
		'cancelImg'  : '/app/webroot/files/uploadify/cancel.png',
		'script'     : '/people/upload',
		'multi'      : false,
		'auto'       : true,
		'buttonText' : 'Upload Picture',
		'fileExt'    : '*.jpg;*.png;*.gif',
		'fileDesc'   : 'Image Files',
		'folder'     : '/app/webroot/img/people',
		'onSWFReady' : function() {
			if ($j('#uploaded_img').is(':visible')) {
				$j('#remove_image').show();
				$j('#image_uploadUploader').hide();
			}
		},
		'onComplete' : function(event,queueID,fileObj,response,data) {
			$j('#PersonImg').val(response);
			$j('#uploaded_img').attr('src', '/app/webroot/img/people/'+response).show();
			$j('#no_image').hide();
			$j('#image_uploadUploader').hide();
			$j('#remove_image').show();
		}
	});
});
</script> 
<?=$this->Form->input('image', array('type' => 'file', 'id' => 'image_upload', 'label' => false))?>
