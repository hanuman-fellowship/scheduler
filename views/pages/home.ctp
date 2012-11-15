<?$this->set('title_for_layout', "Scheduler")?>
<?=$this->element('menu');?>
<?=$this->element('schedule_message')?>
<br>
<div style='text-align:center;margin-right:auto;margin-left:auto;'>
	<?=$this->Html->link('View Big Board',
		array('controller' => 'people', 'action' => 'board'),
		array('class' => 'boxy_button')
	)?>
	<?=$this->Ajax->link('Published Schedules',
		array('controller' => 'schedules', 'action' => 'published'),
		array(
			'id' => 'published_button',
			'class' => 'boxy_button',
			'complete' => "openDialog('published_button',true,'bottom')",
			'update' => 'dialog_content',
		)
	)?>
</div>
<br>
<table style='border:3px solid #ccc;margin-right:auto;margin-left:auto;background-color:#DFDBC3;'>
	<tr>
		<td valign='top' class='left' style='padding:10px'>
			<?=$people?>
		</td>
		<td valign='top' class='left' style='padding:10px'>
			<?=$areas?>
		</td>
	</tr>
</table>
<br>
<div style="margin-right:10%;margin-left:10%">
  <div style="float:left;padding-right:20px">
    <div style='padding:10px;text-align:center;margin-right:auto;margin-left:auto;'>
    <?= $html->tag('a','Hours by Person',array(
      'style' => "font-weight:bold;font-size: 14pt",
      'onmouseout' => 'document.body.style.cursor="default"',
      'onmouseover' => 'document.body.style.cursor="pointer"',
      'onclick' => "$('hours_by_person').toggle()",
      'title' => 'Hide/Show'
    ));?>
    </div>
    <table style='padding:5px;border:3px solid #ccc;margin-right:auto;margin-left:auto;' id='hours_by_person'>
    <? $total_hours = 0 ?>
    <? foreach($person_hours as $num => $person_hour) { ?>
      <? $total_hours = $total_hours + $person_hour['hours'] ?>
      <tr <?=$num&1? "style='background-color:#ddd'" : ""?>>
        <td style='padding-right:20px'><?=$person_hour['name']?></td>
        <td><?=$person_hour['hours']?></td>
      </tr>
    <? } ?>
    <tr>
      <td colspan='2'><hr></td>
    </tr>
    <tr>
      <td><b>Total:</b></td>
      <td><b><?=$total_hours?></b></td>
    </tr>
    </table>
  </div>
  <div style="float:left">
    <div style='padding:10px;text-align:center;margin-right:auto;margin-left:auto;'>
    <?= $html->tag('a','Hours by Area',array(
      'style' => "font-weight:bold;font-size: 14pt",
      'onmouseout' => 'document.body.style.cursor="default"',
      'onmouseover' => 'document.body.style.cursor="pointer"',
      'onclick' => "$('hours_by_area').toggle()",
      'title' => 'Hide/Show'
    ));?>
    </div>
  <table style='padding:5px;border:3px solid #ccc;margin-right:auto;margin-left:auto;' id='hours_by_area'>
  <? $total_hours = 0 ?>
  <? foreach($area_hours as $num => $area_hour) { ?>
    <? $total_hours = $total_hours + $area_hour['hours'] ?>
    <tr <?=$num&1? "style='background-color:#ddd'" : ""?>>
      <td style='padding-right:20px'><?=$area_hour['name']?></td>
      <td><?=$area_hour['hours']?></td>
    </tr>
  <? } ?>
  <tr>
    <td colspan='2'><hr></td>
  </tr>
  <tr>
    <td><b>Total:</b></td>
    <td><b><?=$total_hours?></b></td>
  </tr>
  </table>
  </div>
</div>
<?=$this->element('dialog')?>
