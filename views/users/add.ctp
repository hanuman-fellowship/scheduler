<?= $ajax->form($this->action,'post',array(
	'model'=>'User',
	'update'=>'dialog_content',
	'before'=>'wait()',
	'inputDefaults' => array('between' => '&nbsp;')
));?>
	<fieldset>
 		<legend><?php __('Add User');?></legend>
<div class='tall'>
	<?php
		echo $form->input('username',array('id' => 'username'));
		echo $form->input('email',array('id' => 'email','size'=>'40'));
		echo "<fieldset class='left'>";
		echo '<legend>Roles</legend>';
		echo $form->checkBox('operations');
		echo $form->label('operations');
		echo '<br/>';
		echo $form->checkBox('personnel');
		echo $form->label('personnel');
		echo '<br/>';
		echo $form->checkBox('manager',array('onclick'=>"$('manage_areas').toggle()"));
		echo $form->label('manager');
		echo '<br/>';
		$display = $this->data['User']['manager'] ? '' : 'none';
		echo "<div id='manage_areas' style='display:{$display};padding-left:30px'>";
		echo $form->input('area_id',array('type'=>'select','multiple'=>'checkbox','options'=>$areas));
		echo "</div>";
		echo '</fieldset>';
	?>
</div>
<?php echo $form->end('Submit');?>
	</fieldset>
<?=$this->element('message',array('default_field'=>'username'));?>
