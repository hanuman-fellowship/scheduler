<?= $ajax->form($this->action,'post',array('model'=>'User','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
	<span id='no_close'></span>
	<fieldset>
 		<legend><?php __('Email Other Users');?></legend>
	<table>
	<tr>
		<td colspan='2' class='left'>
		<?="From: {$operationsName} &lt;{$operationsEmail}&gt;"?>
		</td>
	</tr>
	<tr>
		<td colspan='2' class='left'>
		To:
		</td>
	</tr>
	<tr>
	<td valign='top'>
		<hr>
		<div id='users' class='left' style='overflow:auto;max-height:320px'>
		<?= $form->input('to',array(
				'label'    =>  false,
				'type'     => 'select',
				'multiple' => 'checkbox',
				'options'  => $users
			))?>
		</div>
		<hr/>
		<div class='left'>
		<?=$form->checkbox("all",array(
			'onclick' => "checkAll('users',this)"
		));?>
		<label for='UserAll'>All</label>
		</div>
	</td>
	<td width='200px' valign='top' class='left' style='padding-left:30px'>
		<div style='height:60px;border:1px solid #CCC;max-height:60px;overflow:auto'>
		<? if (!isset($this->data['User']['to'])) $this->data['User']['to'] = array()?> 
		<? if (!$this->data['User']['to']) $this->data['User']['to'] = array()?> 
		<? foreach($users as $email => $username) { ?>
			<span class='email_address' <?= in_array($email,$this->data['User']['to']) ? '' : "style='display:none'"?> id="<?=$email?>">&lt;<?=$email?>&gt;, </span>
		<? } ?>
		</div>
		<br>
		<?=$form->input('subject',array('size'=>'50','between'=>'&nbsp;','tabindex'=>1,'id'=>'subject'))?>
		Message:<br>
		<?=$form->textarea('message',array('cols'=>'50','rows'=>'15','tabindex'=>2))?>
		<?= $form->submit('Send',array('tabindex'=>3));?>
	</td>
	</tr>
	</table>
		<?= $form->button('Cancel',array(
			'type' => 'button',
			'onclick' => "force = true; hideDialog();"
		));?>
	</fieldset>
<?= $form->end();?>
<?= $this->element('message',array('default_field'=>'subject'));?>
<?= $javascript->codeBlock("
	$('users').style.width = $('users').getWidth() + 20 + 'px';
	$$('input[type=checkbox]').each(function(item) {
		Event.observe(item, 'click', function(event) {
			$(this.value).toggle();
		});
	});
")?>

