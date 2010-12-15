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
	'shortcut' => 'ctrl+h',
	'codeBlock' =>"
		$('dialog_content').innerHTML = $('hoursBy').innerHTML;
		openDialog('content',true);
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'tab',
	'propagate' => true,
	'codeBlock' =>"
		if ($('dialog').visible()) {
			resetActive();
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
			var active = $$('span.assignment a.assign[rel=active]').first();
			if (active) {
				clickLink(active);
			} else {
				active = $$('span.assignment a[rel=active]').first();
				if (active) {
					clickLink(active.next('a'));
				} else {
					active = $$('a.time[rel=active]').first();
					if (active) {
						clickLink(active);
					} else {
						active = $$('span.shift a[rel=active]').first();
						if (active) {
							clickLink(active);
						} else {
							clickLink($$('a.add[rel=active]').first())
						}
					}
				}
			}
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'right',
	'codeBlock' => "
		if ($('dialog').visible()) {
			if ($('conflictsBox')) {
				var dialog = $('conflictsBox').checked ? $('all') : $('available');
			} else {
				var dialog = $('dialog');
			}
			var active = dialog.down('a[rel=active]');
			newActive = active ? active.up('td').next('td').down('a') : dialog.down('a');
			activate(newActive);
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
			if ($('conflictsBox')) {
				 var dialog = $('conflictsBox').checked ? $('all') : $('available');
			} else {
				var dialog = $('dialog');
			}
			var active = dialog.down('a[rel=active]');
			newActive = active ? active.up('td').previous('td').down('a') : dialog.down('a');
			activate(newActive);
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
			if ($('conflictsBox')) {
				 var dialog = $('conflictsBox').checked ? $('all') : $('available');
			} else {
				var dialog = $('dialog');
			}
			var active = dialog.down('a[rel=active]');
			newActive = active ? active.previous('a') : dialog.down('a');
			activate(newActive);
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
			if ($('conflictsBox')) {
				 var dialog = $('conflictsBox').checked ? $('all') : $('available');
			} else {
				var dialog = $('dialog');
			}
			var active = dialog.down('a[rel=active]');
			newActive = $('dialog').down('a');
			if (!active) active = newActive;
			activate(newActive);
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
			if ($('conflictsBox')) {
				 var dialog = $('conflictsBox').checked ? $('all') : $('available');
			} else {
				var dialog = $('dialog');
			}
			var active = dialog.down('a[rel=active]');
			newActive = active ? active.next('a') : dialog.down('a');
			if (newActive) activate(newActive);
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
			if ($('conflictsBox')) {
				 var dialog = $('conflictsBox').checked ? $('all') : $('available');
			} else {
				var dialog = $('dialog');
			}
			var active = dialog.down('a[rel=active]');
			newActive = active ? active.next('a', 1) : dialog.down('a');
			newActive = newActive ? newActive : active.next('a');
			if (newActive) activate(newActive);
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
<?= $this->element('shortcut',array(
	'shortcut' => 'shift+left',
	'codeBlock' => "
		if ($('dialog').visible()) {
			$('conflictsBox').click();
			resetActive();
		} else {
			$('previousSchedule').style.backgroundColor = '#FFF8BA';
			clickLink($('previousSchedule'));
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'shift+right',
	'codeBlock' => "
		if ($('dialog').visible()) {
			$('conflictsBox').click();
			resetActive();
		} else {
			$('nextSchedule').style.backgroundColor = '#FFF8BA';
			clickLink($('nextSchedule'));
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'shift+down',
	'codeBlock' => "
		if ($('dialog').visible()) {
			$('conflictsBox').click();
			resetActive();
		} else {
			if ($$('a.time').first()) { // area
				var active = $$('a.time[rel=active]').first();
				newActive = active ? active.up('span').next('span').down('a') :
					$$('a.add[rel=active]').first().up('td').down('span').down('a');
			} else { // person
				var active = $$('span.shift a[rel=active]').first();
				newActive = active ? active.up('span.shift').next('span.shift').down('a') :
					$$('a.add[rel=active]').first().up('td').down('span.shift').down('a');
			}
			newActive.up('td').down('a.add').hide();
			activate(newActive);
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'shift+up',
	'codeBlock' => "
		if ($('dialog').visible()) {
			$('conflictsBox').click();
			resetActive();
		} else {
			var active = $$('a.time[rel=active]').first();
			newActive = active ? active.up('span').previous('span').down('a') :
				$$('a.add[rel=active]').first().up('td').down('span').down('a');
			newActive.up('td').down('a.add').hide();
			activate(newActive);
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'ctrl+down',
	'codeBlock' => "
		if ($('dialog').visible()) {
		} else {
			var active = $$('span.assignment a[rel=active]').first();
			newActive = active ? active.up('span').next('span').down('a') :
				$$('a.time[rel=active]').first().up('span').down('span').down('a');
			newActive.up('td').down('a.time').style.backgroundColor = '';
			activate(newActive);
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'ctrl+up',
	'codeBlock' => "
		if ($('dialog').visible()) {
		} else {
			var active = $$('span.assignment a[rel=active]').first();
			newActive = active ? active.up('span').previous('span').down('a') :
				$$('a.time[rel=active]').first().up('span').down('span').down('a');
			newActive.up('td').down('a.time').style.backgroundColor = '';
			activate(newActive);
		}
	"
));?>
<?= $this->element('shortcut',array(
	'shortcut' => 'backspace',
	'disable_in_input' => true,
	'codeBlock' => "
		// this one uses window.location instead of clickLink()
		// because clickLink() was doing nasty things in some browsers
		var active = $$('span.assignment a[rel=active]').first();
		if (active) {
			window.location = active.href;
		} else {
			active = $$('a.time[rel=active]').first();
			if (active) {
				window.location = active.next('a').href; 
			} else {
				active = $$('span.shift a[rel=active]').first();
				if (active) {
					window.location = active.up().next('a').href;
				}
			}
		}
	"
));?>
