<?php
class HouseCategory extends AppModel {

	var $name = 'HouseCategory';

	var $hasMany = array(
		'House'
	);

}
