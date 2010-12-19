<?php
class ResidentCategoriesController extends AppController {

	var $name = 'ResidentCategories';

	function edit($id = null) {
		$this->redirectIfNotEditable();
		if ($id || $this->data) {
			if (!empty($this->data)) {
				if ($this->ResidentCategory->valid($this->data)) {
					$this->record();
					$changes = $this->ResidentCategory->sSave($this->data);
					$this->stop($this->ResidentCategory->description($changes));
					$this->set('url', $this->referer());
				 } else {
					$this->set('errorField',$this->ResidentCategory->errorField);
					$this->set('errorMessage',$this->ResidentCategory->errorMessage);
				}
			} else {
				$this->ResidentCategory->id = $id;
				$this->ResidentCategory->recursive = -1;
				$this->data = $this->ResidentCategory->sFind('first');
			}
		} else {
			$this->set('categories',$this->ResidentCategory->sFind('list'));
			$this->render('select_edit');
		}
	}

}
?>
