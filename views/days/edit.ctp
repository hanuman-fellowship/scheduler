<?= $ajax->form($this->action,'post',array(
	'model'=>'Day',
	'update'=>'dialog_content',
	'before'=>'wait();saveScroll()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('Edit Days');?></legend>
	<?= $form->radio('number',
		array('1'=>'1','2'=>'2','3'=>'3','4'=>'4','5'=>'5','6'=>'6','7'=>'7'),
		array(
			'value' => count($days),
			'separator' => '&nbsp;&nbsp;',
			'onclick' => "
				day = this.id.substring(9);
				$$('.day').each(function(e){
					if (e.id.substring(3) > day) {
						e.hide();
						e.next('br').hide();
					} else {
						e.show();
						e.next('br').show();
					}
				});
				$$('.day[value=\"\"]').first().focus();
			"
		)
	)?>
	<br>
	<? for ($i = 1; $i <= 7; $i++) { ?>
		<? $style = $i > count($days) ? 'display:none' : ''?>
		<?= $form->text($i,array(
			'style' => $style,
			'class' => "day",
			'value' => isset($days[$i]) ? $days[$i] : ''
		))?>
		<br style="<?=$style?>">
	<? } ?>
	<br>
	<?= $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'Day1'))?>
