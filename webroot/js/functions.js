var highlighted = '';
var stopClick = false;

function get(id) {
	return document.getElementById(id);
}

function showAddShift(slot,day) {
	var addElement = get('add_'+slot+'_'+day);
	loc = findPos(get(slot+'_'+day));
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
	if (!stopClick && get('dialog').style.zIndex != 999) {
		if(highlighted != '') {
			get(highlighted).style.backgroundColor = '';
		}
		get('dialog').style.display = 'none';
		get('behind_dialog').style.display = 'none';
	}
	stopClick = false;
}

function openDialog(id,noHighlight,position) {
	if (get(id+'_sub')) {
		get(id+'_sub').style.display = 'none';
	}
	behind = get('behind_dialog');
	behind.style.height = document.body.offsetHeight + 5 + 'px';
	behind.style.width = document.body.offsetWidth + 'px';
	behind.style.display = 'table';
	behind.style.zIndex = 1000;
	get('dialog').style.display = 'table';
	if (!noHighlight) {
		get(id).style.backgroundColor = '#FFF8BA';
		highlighted = id;
	}

	if (!position) {
		position = 'right';
	}
	// find the the object that we're positioning relative to
	loc = findPos(get(id));
	objX = loc[0];
	objY = loc[1];
	objWidth = get(id).offsetWidth;
	objHeight = get(id).offsetHeight;
	
	// get the window dimensions
	windowWidth = f_clientWidth();
	windowHeight = f_clientHeight();

	// get the dialog dimensions
	dialogWidth = get('dialog').offsetWidth;
	dialogHeight = get('dialog').offsetHeight;

	if (position == 'left') {
		newLeft = objX - f_scrollLeft() - dialogWidth - 20;
		newTop = objY - f_scrollTop() - (dialogHeight/2) + (objHeight/2);
	}

	if (position == 'right') {
		newLeft = objX - f_scrollLeft() + objWidth + 20;
		newTop = objY - f_scrollTop() - (dialogHeight/2) + (objHeight/2);
	}
	
	if (position == 'top') {
		newLeft = objX - f_scrollLeft() - (dialogWidth/2) + (objWidth/2);
		newTop = objY - f_scrollTop() - dialogHeight;
	}
	
	if (position == 'bottom') {
		newLeft = objX - f_scrollLeft() - (dialogWidth/2) + (objWidth/2);
		newTop = objY - f_scrollTop() + objHeight;
	}

	// if it's off screen to the right, move the dialog to the other side of the element
	if (newLeft + dialogWidth > windowWidth) { 
		newLeft = newLeft - dialogWidth - objWidth - 40;
	}

	// if it's off screen to the left, move the dialog to the other side of the element
	if (newLeft < 0) { 
		newLeft = 10;
	}

	// if it's below the bottom of the window, move it up
	if (newTop + dialogHeight > windowHeight) {
		newTop = windowHeight - dialogHeight;
	}
	
	// if it's above the top of the window, move it down
	if (newTop < 0) {
		newTop = 10;
	}
	get('dialog').style.left = newLeft+'px';
	get('dialog').style.top = newTop+'px';
	get('dialog').style.zIndex = 1001;
	get('drag_here').style.width = dialogWidth + 'px';
	new Draggable('dialog',{scroll:window,handle:'drag_here'});
	new Resizeable('dialog_content', {top: 0, left:0, right:10, bottom:10});
	document.onclick = hideDialog;
	get('dialog').onclick = clickInDialog; 
}

function wait() {
	get('dialog').style.zIndex = 999;
	hideElement('error');
	showElement('wait');
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

function clickInDialog() {
	stopClick = true;
}

function f_clientWidth() {
	return f_filterResults (
		window.innerWidth ? window.innerWidth : 0,
		document.documentElement ? document.documentElement.clientWidth : 0,
		document.body ? document.body.clientWidth : 0
	);
}
function f_clientHeight() {
	return f_filterResults (
		window.innerHeight ? window.innerHeight : 0,
		document.documentElement ? document.documentElement.clientHeight : 0,
		document.body ? document.body.clientHeight : 0
	);
}
function f_scrollLeft() {
	return f_filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}
function f_scrollTop() {
	return f_filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}
function f_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

function saveScroll() {
	document.cookie = "scrollTop="+f_scrollTop();
	document.cookie = "scrollLeft="+f_scrollLeft();
}

function setScroll() {
	window.scroll(getCookie('scrollLeft'),getCookie('scrollTop'));
	document.cookie = "scrollTop=;";
	document.cookie = "scrollLeft=;";	
}

function getCookie ( cookie_name ) {
	var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
	if ( results ) {
		return ( unescape ( results[2] ) );
	} else {
		return null;
	}
}

function swap(a, b) {
	toggleDisplay(a);
	toggleDisplay(b);
}

function toggleDisplay(id) {
	get(id).style.display = (get(id).style.display == 'none') ? '' : 'none';
}
