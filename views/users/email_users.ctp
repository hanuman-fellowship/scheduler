<?= $ajax->form($this->action,'post',array('model'=>'User','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Email Other Users');?></legend>
	<table>
	<tr>
	<td valign='top' class='tall left'>
		<div id='users'>
		To:<hr>
		<?= $form->input('to',array(
				'label'    =>  false,
				'type'     => 'select',
				'multiple' => 'checkbox',
				'options'  => Set::combine(array_values($users),'{n}.User.email','{n}.User.username'),
			))?>
		<hr/>
		<?=$form->checkbox("all",array(
			'onclick' => "checkAll('users',this)"
		));?>
		<label for='UserAll'>All</label>
		</div>
	</td>
	<td align='left' style='padding-left:30px'>
		<?=$form->input('subject',array('size'=>'50','between'=>'&nbsp;','tabindex'=>1,'id'=>'subject'))?>
		Message:<br>
		<?=$form->textarea('message',array('cols'=>'50','rows'=>'20','tabindex'=>2))?>
	</td>
	</tr>
	</table>
	</fieldset>
<?= $form->submit('Send',array('tabindex'=>3));?>
<?= $form->end();?>
<?= $this->element('message',array('default_field'=>'subject'));?>
