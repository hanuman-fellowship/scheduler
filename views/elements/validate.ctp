<? $url = (isset($url)) ? $html->url($url) : false;?>
<? $selectField = (isset($errorField)) ? $errorField : $default_field;?>
<?=$dialog->reload($url,$selectField);?>
<span style="color:red;position:relative;top:5px">
<?= (isset($errorMessage)) ? $errorMessage : '';?>
</span>
