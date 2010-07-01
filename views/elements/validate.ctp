<? $url = (isset($url)) ? $html->url($url) : false;?>
<? $selectField = (isset($errorField)) ? $errorField : $default_field;?>
<?=$dialog->reload($url,$selectField);?>
<span style="color:red">
<?= (isset($errorMessage)) ? $errorMessage : '';?>
</span>
