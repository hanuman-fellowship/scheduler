<link href="/app/webroot/css/uploadify.css" type="text/css" rel="stylesheet" /> 
<script type="text/javascript" src="/app/webroot/js/jquery.js"></script> 
<script type="text/javascript" src="/app/webroot/files/uploadify/swfobject.js"></script> 
<script type="text/javascript"> 
    jQuery.noConflict();
</script>
<script type="text/javascript" src="/app/webroot/js/jquery.uploadify.v2.1.4.min.js"></script> 
<script type="text/javascript"> 
jQuery(document).ready(function($) {
	$('#image_upload').uploadify({
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
			if ($('#uploaded_img').is(':visible')) {
				$('#remove_image').show();
				$('#image_uploadUploader').hide();
			}
		},
		'onComplete' : function(event,queueID,fileObj,response,data) {
			$('#uploaded_img').attr('src', '/app/webroot/img/people/'+response).show();
			$('#no_image').hide();
			$('#image_uploadUploader').hide();
			$('#remove_image').show();
		}
	});
});
</script> 
<?=$this->Form->input('image', array('type' => 'file', 'id' => 'image_upload', 'label' => false))?>
