<fieldset>
	<legend><?php __('Reorder Categories');?></legend>
	<i>Drag a category to change the order</i><hr>
<div class='tall left'>
<ul id='lcategories'>
	<? $category_ids = ''?>
	<? foreach($categories as $id => $category) { ?>
		<? $category_ids .= $id.','?>
		<li id='lpnote_<?=$id?>'>
		<i>
			<?=$html->tag('span',$category,array(
				'onclick' => "
					if (saveOrder('lcategories')) 
						clickLink(this.up('li').down('a.edit'));
				",
				'onmouseover' => "this.style.cursor='pointer'",
			))?>
		</i></li>
	<? } ?>	
	<? $category_ids = substr_replace($category_ids,'',-1) ?>
</ul>
<?=$ajax->sortable('lcategories')?>
<?=$ajax->form(array('type' => 'post',
		'options' => array(
				'id' => 'lcategories_form',
				'model'=>'ResidentCategory',
				'url' => array(
						'controller' => 'residentCategories',
						'action' => 'reorder'
				),
				'before' => 'wait()',
				'complete' => "window.location.reload()"
		)
));?>
<?=$form->hidden('lcategories_order',array('id'=>'lcategories_order','value'=>$category_ids));?>
<?=$form->submit('submit',array('id'=>'lcategories_submit','style'=>'display:none'));?>
<?=$form->end()?>
</fieldset>
</div>
<?=$this->element('message');?>
