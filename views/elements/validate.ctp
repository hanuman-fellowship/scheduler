<? $url = (isset($url)) ? $html->url($url) : false;?>
<? $selectField = (isset($errorField)) ? $errorField : $default_field;?>
<?=$dialog->reload($url,$selectField);?>
<div id='error' style="clear:both;color:red;position:relative;top:5px">
<?= (isset($errorMessage)) ? $errorMessage : '';?>
</div>
<div id='wait' style="display:none;clear:both;color:green;position:relative;top:5px">
	Please wait...
</div>
