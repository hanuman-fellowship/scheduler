<?= $ajax->form($this->action,'post',array('model'=>'User','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Email Other Users');?></legend>
	<table>
	<tr>
		<td width = '200px' colspan='2' class='left'>
		To:
		<? foreach($users as $email => $username) { ?>
			<span class='email_address' style="display:none" id="<?=$email?>">&lt;<?=$email?>&gt;, </span>
		<? } ?>
		</td>
	</tr>
	<tr>
	<td valign='top' class='tall left'>
		<div id='users'>
		<hr>
		<?= $form->input('to',array(
				'label'    =>  false,
				'type'     => 'select',
				'multiple' => 'checkbox',
				'options'  => $users
			))?>
		<hr/>
		<?=$form->checkbox("all",array(
			'onclick' => "checkAll('users',this)"
		));?>
		<label for='UserAll'>All</label>
		</div>
	</td>
	<td valign='top' class='left' style='padding-left:30px'>
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
<?= $javascript->codeBlock("
	$$('input[type=checkbox]').each(function(item) {
		Event.observe(item, 'click', function(event) {
			$(this.value).toggle();
		});
	});
")?>

