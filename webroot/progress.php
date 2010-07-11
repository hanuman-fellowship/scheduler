<?
//get data from the progress file
$fileatt = "progress{$_GET['user']}.txt";
$file = fopen($fileatt,'rb'); 
$data = fread($file,filesize($fileatt)); 
fclose($file);

// split the data into parts
$data = explode('|',$data);
$message = $data[0];
$percent = $data[1];
?>
<? if ($file) { ?>
<center><?=$message;?><br>
<div style='border:6px double #ccc;width:200px;margin-top:15px;padding:0;height:14px;'>
<div id='progress_bar' style='float:left;color:#FFF;background-color:#FF8D40;height:12px;padding-bottom:2px;font-size:12px;text-align:center;overflow:hidden;line-height:1.2em;width:<?=$percent;?>%'>
</div>
</div>
</center>
<? } ?>
