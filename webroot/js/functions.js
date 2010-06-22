var highlighted = '';

function get(id) {
	return document.getElementById(id);
}

function showAddShift(slot,day) {
	var addElement = document.getElementById('add_'+slot+'_'+day);
	loc = findPos(document.getElementById(slot+'_'+day));
	addElement.style.left = loc[0];
	addElement.style.top = loc[1]+3+'px';
	addElement.style.display = 'block';
}

function hideAddShift(id) {
	var addElement = document.getElementById('add_'+id);
	addElement.style.display = 'none';
}

function showElement(id) {
	get(id).style.display = 'block';
}

function hideElement(id) {
	get(id).style.display = 'none';
}

function hideDialog() {
	if(highlighted != '') {
		get(highlighted).style.backgroundColor = '#FFFFFF';
	}
	get('dialog').style.display = 'none';
}

function openDialog(id,color) {
	get('dialog').style.display = 'block';
	get('dialog_content').style.backgroundColor = color;
	get(id).style.backgroundColor = '#FFF8BA';
	highlighted = id;
}

function toggleConflicts() {
	if (get('conflictsBox').checked) {
		get('available').style.display = 'none';
		get('all').style.display = '';
	} else {
		get('available').style.display = '';
		get('all').style.display = 'none';
	}	
}

function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
	do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	return [curleft,curtop];
	}
}		

function stopclick(e) {
	if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
}