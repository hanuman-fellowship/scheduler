<? $url = (isset($url)) ? $html->url($url) : false;?>
<? $selectField = (isset($errorField)) ? $errorField : $default_field;?>
<?=$dialog->reload($url,$selectField);?>
<div style="clear:both;color:red;position:relative;top:5px">
<?= (isset($errorMessage)) ? $errorMessage : '';?>
</div>
