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
	if (!stopClick) {
		if(highlighted != '') {
			get(highlighted).style.backgroundColor = '#FFFFFF';
		}
		get('dialog').style.display = 'none';
	}
	stopClick = false;
}

function openDialog(id,color,noHighlight) {
	get('dialog_content').style.backgroundColor = color;
	get('dialog').style.display = 'table';
	if (!noHighlight) {
		get(id).style.backgroundColor = '#FFF8BA';
		highlighted = id;
	}
	loc = findPos(get(id));
	windowWidth = f_clientWidth();
	windowHeight = f_clientHeight();
	dialogWidth = get('dialog').offsetWidth;
	dialogHeight = get('dialog').offsetHeight;
	linkWidth = get(id).offsetWidth;
	newLeft = loc[0]-f_scrollLeft()+linkWidth+20;
	newTop = loc[1]-f_scrollTop()-30;
	
	// if it's off screen to the right, move the dialog to the other side of the element
	if (newLeft + dialogWidth > windowWidth) { 
		newLeft = newLeft - dialogWidth - linkWidth - 40;
	}
	
	// if it's below the bottom of the window, move it up
	if (newTop + dialogHeight > windowHeight) {
		newTop = windowHeight - dialogHeight;
	}
	
	// if it's above the top of the window, move it down
	if (newTop < 0) {
		newTop = 0;
	}
	get('dialog').style.left = newLeft+'px';
	get('dialog').style.top = newTop+'px';
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