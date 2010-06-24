<? $this->pageTitle=$area['Area']['name']." Schedule"; ?>
<body onclick="hideDialog()">  
<?=$this->element('schedule');?>
<div id='schedule_content'>
<?=$this->element('schedule_content');?>
</div>
<?=$this->element('dialog');?>
</body>