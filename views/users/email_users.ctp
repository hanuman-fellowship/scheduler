<?= $ajax->form($this->action,'post',array('model'=>'User','update'=>'dialog_content','before'=>'wait();saveScroll()'));?>
	<fieldset>
 		<legend><?php __('Email Other Users');?></legend>
	<table>
	<tr>
		<td colspan='2' class='left'>
		<?=$ajax->link("From: Operations <{$operationsEmail}>",
			array(
				'controller' => 'EmailAuths',
				'action' => 'edit'
			),
			array(
				'update' => 'dialog_content',
			))?>
		</td>
	</tr>
	<tr>
		<td colspan='2' class='left'>
		To:
		</td>
	</tr>
	<tr>
	<td valign='top'>
		<div id='users' class='left' style='overflow:auto;max-height:350px'>
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
	</td>
	</tr>
	</table>
	</fieldset>
<?= $form->submit('Send',array('tabindex'=>3));?>
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

