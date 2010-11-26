<? if ($this->params['isAjax'] && $area['Area']['id'] == 0) {
	echo $javascript->codeBlock("window.location = '{$html->url('/')}'");
	echo "Redirecting...";
	die;
} ?>
<?=$this->element('menu',array('area'=>$area['Area']['id']));?>
<?=$this->element('schedule_message');?>
<? 
if($area['Area']['id'] == 0) {
	echo $this->element('splash');
	$this->set('title_for_layout', "Scheduler");
} else {
	echo $this->element('schedule_content');
	$this->set('title_for_layout', $area['Area']['name']." Schedule");
}
?>
<?=$this->element('dialog');?>
