<? preg_match('/^.*app/', $_SERVER['SCRIPT_NAME'], $matches)?>
<? $path = $matches[0] ?>
<?=$html->css('uploadify')?>
<?=$html->script('jquery')?>
<?=$html->script('../files/uploadify/swfobject')?>
<script type="text/javascript"> 
    jQuery.noConflict();
</script>
<?=$html->script('jquery.uploadify.v2.1.4.min')?>
<script type="text/javascript"> 
jQuery(document).ready(function($) {
	$('#image_upload').uploadify({
    'uploader'   : '<?=$html->url('/')?>files/uploadify/uploadify.swf',
    'cancelImg'  : '<?=$html->url('/')?>files/uploadify/cancel.png',
    'script'     : '<?=$html->url('/')?>people/upload/<?=$id?>',
		'multi'      : false,
		'auto'       : true,
		'buttonText' : 'Upload Photo',
		'fileExt'    : '*.jpg;*.png;*.gif',
		'fileDesc'   : 'Image Files',
    'folder'     : '<?=$path?>/webroot/img/people',
		'onSWFReady' : function() {
			if ($('#uploaded_img').is(':visible')) {
				$('#remove_image').show();
				$('#image_uploadUploader').hide();
			}
		},
		'onComplete' : function(event,queueID,fileObj,response,data) {
      $('#uploaded_img').attr('src', '<?=$html->url('/')?>img/people/'+response).show();
			$('#no_image').hide();
			$('#image_uploadUploader').hide();
			$('#remove_photo').show();
		}
	});
});
</script> 
<?=$this->Form->input('image', array('type' => 'file', 'id' => 'image_upload', 'label' => false))?>
