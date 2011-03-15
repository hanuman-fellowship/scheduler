<? $error = !empty($this->data) ?>
<?= $ajax->form($this->action,'post',array(
	'model'=>false,
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('Edit Times');?></legend>
<table align="center" cellpadding="5" cellspacing="0" > 
	<tr> 
		<td bordercolor="#000000"> 
		</td> 
<? foreach ($bounds['days'] as $day_id => $day) { ?>
		<td bordercolor="#000000"> 
			<div align="center"> 
				<?=$day;?>
			</div> 
		</td>
<? } ?>
	</tr>	
<? foreach ($bounds['slots'] as $slot_num => $slot) { ?>
	<tr> 
		<td bordercolor="#000000"> 
			<div align="center"> 
				<?=$form->input("slot_{$slot_num}",array(
					'value' => $error? $this->data["slot_{$slot_num}"] : $slot,'label'=>false
				))?> 
			</div> 
		</td> 
	<? foreach ($bounds['days'] as $day => $d) { ?>
		<td>
			<div align="center"> 
			</div> 
		</td> 
	<? } ?>
	</tr>
	<? if (count($bounds['slots']) > $slot_num) { ?>
		<tr>
		<td></td>
		<? foreach ($bounds['days'] as $day => $d) { ?>
			<td>
				<div align="center"> 
				<?=$form->input("bound_{$slot_num}_{$day}", array(
					'value' => $error? 
						$this->data["bound_{$slot_num}_{$day}"] :
						date('g:ia',strtotime($bounds['bounds'][$slot_num][$day]['end'])),
					'label' => false,
					'size' => '8'
				))?>
				</div> 
			</td> 
		<? } ?>
		</tr>
	<? } ?>
<? } ?>
</table> 
<?= $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'slot_1'));?>
