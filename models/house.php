<?php
class House extends AppModel {

	var $name = 'House';

	var $belongsTo = array(
		'HouseCategory',
		'Person'
	);

}
