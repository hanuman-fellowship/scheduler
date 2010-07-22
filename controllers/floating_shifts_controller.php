<?php
class FloatingShiftsController extends AppController {

	var $name = 'FloatingShifts';

	function add($area_id = null, $person_id = null) {
		if (!empty($this->data)) {
			if ($this->FloatingShift->valid($this->data)) {
				$this->FloatingShift->create();
				$this->record();
				$this->FloatingShift->sSave($this->data);
				$this->stop($this->FloatingShift->description);
				$this->set('url',$this->loadPage() );
			} else {
				$this->set('errorField',$this->FloatingShift->errorField);
				$this->set('errorMessage',$this->FloatingShift->errorMessage);
			}
		}
		$this->savePage();
		$this->loadModel('Area');
		$this->Area->order = 'name';
		$this->set('areas',$this->Area->sFind('list'));
		$this->set('area_id',$area_id);
		$this->loadModel('Person');
		$this->set('people',$this->Person->getList());
		$this->set('person_id',$person_id);
	}

}
?>
