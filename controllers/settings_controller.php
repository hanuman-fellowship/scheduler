<?php
class SettingsController extends AppController {

	var $name = 'Settings';

	function toggleDates() {
		$this->redirectIfNot('operations');
		$val = $this->loadSetting('show_dates');
		$val = $val === '1'? 0 : 1;
		$this->saveSetting('show_dates', $val);
		$this->redirect($this->referer());
	}

}
