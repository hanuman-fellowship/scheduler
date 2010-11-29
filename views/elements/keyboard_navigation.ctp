<?= $this->element('shortcut',array(
	'shortcut' => 'esc',
	'codeBlock' =>"
		if ($('dialog').visible()) {
			hideDialog();
		} else {
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'return',
	'codeBlock' =>"
		if ($('dialog').visible()) {
			clickLink($('dialog').down('a[rel=active]'));
		} else {
			clickLink($$('a.add[rel=active]').first())
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'right',
	'codeBlock' => "
		if ($('dialog').visible()) {
			var active = $('dialog').down('a[rel=active]');
			newActive = active ? active.up('div').next('div').down('a') : $('dialog').down('a');
			newActive.style.backgroundColor = '#FFF8BA';
			newActive.rel = 'active';
			active.style.backgroundColor = '';
			active.rel = '';
			newActive.scrollIntoView(false);
		} else {
			var active = getActive();
			var newActive = active.up('td').next('td').down('a.add');
			newActive = newActive ? newActive : active;
			showAddShift(newActive);
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'alt+right',
	'disable_in_dialog' => true,
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
		if ($('dialog').visible()) {
			var active = $('dialog').down('a[rel=active]');
			newActive = active ? active.up('div').previous('div').down('a') : $('dialog').down('a');
			newActive.style.backgroundColor = '#FFF8BA';
			newActive.rel = 'active';
			active.style.backgroundColor = '';
			active.rel = '';
			newActive.scrollIntoView(false);
		} else {
			var active = getActive();
			var newActive = active.up('td').previous('td').down('a.add');
			newActive = newActive ? newActive : active;
			showAddShift(newActive);
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'alt+left',
	'disable_in_dialog' => true,
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
		if ($('dialog').visible()) {
			var active = $('dialog').down('a[rel=active]');
			newActive = active ? active.previous('a') : $('dialog').down('a');
			newActive.style.backgroundColor = '#FFF8BA';
			newActive.rel = 'active';
			active.style.backgroundColor = '';
			active.rel = '';
			newActive.scrollIntoView(false);
		} else {
			var active = getActive();
			td = active.up('td');
			for (tdNum = -1; td; tdNum++) {
				td = td.previous('td');
			}
			newActive = active.up('tr').previous('tr').down('td',tdNum).down('a.add');
			newActive = newActive ? newActive : active;
			showAddShift(newActive);
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'alt+up',
	'codeBlock' => "
		if ($('dialog').visible()) {
			var active = $('dialog').down('a[rel=active]');
			newActive = $('dialog').down('a');
			if (!active) active = newActive;
			active.style.backgroundColor = '';
			active.rel = '';
			newActive.style.backgroundColor = '#FFF8BA';
			newActive.rel = 'active';
			newActive.scrollIntoView(false);
		} else {
			var active = getActive();
			td = active.up('td');
			for (tdNum = -1; td; tdNum++) {
				td = td.previous('td');
			}
			var newActive = active.up('table').down('tr',1).down('td',tdNum).down('a.add');
			newActive = newActive ? newActive : active;
			showAddShift(newActive);
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'down',
	'codeBlock' => "
		if ($('dialog').visible()) {
			var active = $('dialog').down('a[rel=active]');
			newActive = active ? active.next('a') : $('dialog').down('a');
			newActive.style.backgroundColor = '#FFF8BA';
			newActive.rel = 'active';
			active.style.backgroundColor = '';
			active.rel = '';
			newActive.scrollIntoView(false);
		} else {
			var active = getActive();
			td = active.up('td');
			for (tdNum = -1; td; tdNum++) {
				td = td.previous('td');
			}
			var newActive = active.up('tr').next('tr').down('td',tdNum).down('a.add');
			newActive = newActive ? newActive : active;
			showAddShift(newActive);
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'alt+down',
	'codeBlock' => "
		if ($('dialog').visible()) {
			var active = $('dialog').down('a[rel=active]');
			newActive = active ? active.next('a', 1) : $('dialog').down('a');
			newActive = newActive ? newActive : active.next('a');
			newActive.style.backgroundColor = '#FFF8BA';
			newActive.rel = 'active';
			active.style.backgroundColor = '';
			active.rel = '';
			newActive.scrollIntoView(false);
		} else {
			var active = getActive();
			td = active.up('td');
			for (tdNum = -1; td; tdNum++) {
				td = td.previous('td');
			}
			var newActive = active.up('table').down('tr',4).down('td',tdNum).down('a.add'); 
			showAddShift(newActive);
		}
	"
));?>

<?// Click Day Off ?>
<?= $this->element('shortcut',array(
	'shortcut' => 'ctrl+d',
	'disable_in_dialog' => true,
	'codeBlock' => "
		var active = getActive();
		td = active.up('td');
		for (tdNum = -1; td; tdNum++) {
			td = td.previous('td');
		}
		clickLink(active.up('tr').siblings().first().down('td',tdNum).down('a'));
	"
));?>

<?= $this->element('shortcut',array(
	'shortcut' => 'n',
	'disable_in_dialog' => true,
	'codeBlock' => "
		var active = getActive();
		td = active.up('td');
		for (tdNum = -1; td; tdNum++) {
			td = td.previous('td');
		}
		clickLink($('notes').down('a'));
	"
));?>