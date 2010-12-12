<? $url = (isset($url)) ? $html->url($url) : false;?>
<? $default_field = isset($default_field) ? $default_field : ''; ?>
<? $selectField = (isset($errorField)) ? $errorField : $default_field;?>
<?=$dialog->reload($url,$selectField);?>
<div id='flash' style="clear:both;color:green;position:relative;top:5px">
<?= (isset($flash)) ? $flash : '';?>
</div>
<div id='error' style="clear:both;color:red;position:relative;top:5px">
<?= (isset($errorMessage)) ? $errorMessage : '';?>
</div>
<? $wait_style = !$url ? 'display:none;' : ''; ?>
<div id='wait' style="<?=$wait_style?>clear:both;color:green;position:relative;top:5px">
	Please wait...
</div>
