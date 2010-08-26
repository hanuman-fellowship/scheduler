<? $this->set('title_for_layout', $area['Area']['name']." Schedule"); ?>
<?=$this->element('menu',array('area'=>$area['Area']['id']));?>
<?=$this->element('schedule_message');?>
<? 
if($area['Area']['id'] == 0) {
	echo $this->element('splash');
} else {
	echo $this->element('schedule_content');
}
?>
<?=$this->element('dialog');?>
