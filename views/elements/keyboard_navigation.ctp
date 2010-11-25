<?= $this->element('shortcut',array(
	'shortcut' => 'esc',
	'codeBlock' =>"hideDialog()"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'return',
	'codeBlock' =>"clickLink($$('a.add[rel=active]').first())"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'right',
	'codeBlock' => "
		var active = getActive();
		var newActive = active.up('td').next('td').down('a.add');
		newActive = newActive ? newActive : active;
		showAddShift(newActive);
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'alt+right',
	'codeBlock' => "
		var active = getActive();
		var newActive = active.up('td').siblings().last().down('a.add');
		newActive = newActive ? newActive : active;
		showAddShift(newActive);
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'left',
	'codeBlock' => "
		var active = getActive();
		var newActive = active.up('td').previous('td').down('a.add');
		newActive = newActive ? newActive : active;
		showAddShift(newActive);
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'alt+left',
	'codeBlock' => "
		var active = getActive();
		var newActive = active.up('td').siblings().first().next('td').down('a.add');
		newActive = newActive ? newActive : active;
		showAddShift(newActive);
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'up',
	'codeBlock' => "
		var active = getActive();
		td = active.up('td');
		for (tdNum = -1; td; tdNum++) {
			td = td.previous('td');
		}
		newActive = active.up('tr').previous('tr').down('td',tdNum).down('a.add');
		newActive = newActive ? newActive : active;
		showAddShift(newActive);
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'alt+up',
	'codeBlock' => "
		var active = getActive();
		td = active.up('td');
		for (tdNum = -1; td; tdNum++) {
			td = td.previous('td');
		}
		var newActive = active.up('table').down('tr',1).down('td',tdNum).down('a.add');
		newActive = newActive ? newActive : active;
		showAddShift(newActive);
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'down',
	'codeBlock' => "
		var active = getActive();
		td = active.up('td');
		for (tdNum = -1; td; tdNum++) {
			td = td.previous('td');
		}
		var newActive = active.up('tr').next('tr').down('td',tdNum).down('a.add');
		newActive = newActive ? newActive : active;
		showAddShift(newActive);
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'alt+down',
	'codeBlock' => "
		var active = getActive();
		td = active.up('td');
		for (tdNum = -1; td; tdNum++) {
			td = td.previous('td');
		}
		var newActive = active.up('table').down('tr',4).down('td',tdNum).down('a.add'); 
		showAddShift(newActive);
	"
));?>

<?// Click Day Off ?>
<?= $this->element('shortcut',array(
	'shortcut' => 'ctrl+d',
	'codeBlock' => "
		var active = getActive();
		td = active.up('td');
		for (tdNum = -1; td; tdNum++) {
			td = td.previous('td');
		}
		clickLink(active.up('tr').siblings().first().down('td',tdNum).down('a'));
	"
));?>

