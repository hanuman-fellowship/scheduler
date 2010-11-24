var highlighted = '';
var stopClick = false;

function showAddShift(slot,day) {
	var addElement = $('add_'+slot+'_'+day);
	loc = findPos($(slot+'_'+day));
	addElement.style.left = loc[0];
	addElement.style.top = loc[1]+3+'px';
	addElement.style.display = 'block';
}

function clickLink(link) {
	var cancelled = false;

	if (document.createEvent) {
		var event = document.createEvent("MouseEvents");
		event.initMouseEvent("click", true, true, window,
			0, 0, 0, 0, 0,
			false, false, false, false,
		0, null);
		cancelled = !link.dispatchEvent(event);
	}
	else if (link.fireEvent) {
		cancelled = !link.fireEvent("onclick");
	} 

	if (!cancelled) {
		window.location = link.href;
	}
}

function hideDialog() {
	if (!stopClick && $('dialog').style.zIndex != 999) {
		if(highlighted != '') {
			$(highlighted).style.backgroundColor = '';
		}
		$('dialog').style.display = 'none';
		$('behind_dialog').style.display = 'none';
	}
	stopClick = false;
}

function openDialog(id,noHighlight,position) {
	if ($(id+'_sub')) {
		$(id+'_sub').style.display = 'none';
	}
	behind = $('behind_dialog');
	behind.style.height = document.body.offsetHeight + 5 + 'px';
	behind.style.width = document.body.offsetWidth + 'px';
	behind.style.display = 'table';
	behind.style.zIndex = 1000;
	$('dialog').show();
	if (!noHighlight) {
		$(id).style.backgroundColor = '#FFF8BA';
		highlighted = id;
	}

	if (!position) {
		position = 'right';
	}

	// find the the object that we're positioning relative to
	loc = findPos($(id));
	objX = loc[0];
	objY = loc[1];
	objWidth = $(id).offsetWidth;
	objHeight = $(id).offsetHeight;
	
	// get the window dimensions
	windowWidth = f_clientWidth();
	windowHeight = f_clientHeight();

	// get the dialog dimensions
	dialogWidth = $('dialog').offsetWidth;
	dialogHeight = $('dialog').offsetHeight;

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
	$('dialog').style.left = newLeft+'px';
	$('dialog').style.top = newTop+'px';

	$('dialog').style.zIndex = 1001;
	$('drag_here').style.width = dialogWidth + 'px';
	new Draggable('dialog',{scroll:window,handle:'drag_here'});
//	new Resizeable('dialog_content', {top: 0, left:0, right:10, bottom:10});
	document.onclick = hideDialog;
	$('dialog').onclick = clickInDialog; 
}

function keepOnScreen(id) {
	// get the window dimensions
	windowWidth = f_clientWidth();
	windowHeight = f_clientHeight();

	// get the object position
	loc = findPos($(id));
	objX = loc[0];
	objY = loc[1];

	// get the object dimensions
	objWidth = $(id).offsetWidth;
	objHeight = $(id).offsetHeight;

	// if it's off screen to the right, move it to the left 
	if (objX + objWidth > windowWidth) { 
		newLeft = objX - objWidth - 10;
	}

	// if it's off screen to the left, move it to the right
	if (objX < 0) { 
		newLeft = 10;
	}

	// if it's below the bottom of the window, move it up
	if (objY + objHeight > windowHeight) {
		newTop = windowHeight - objHeight;
	}
	
	// if it's above the top of the window, move it down
	if (objY < 0) {
		newTop = 10;
	}
	$(id).style.left = newLeft+'px';
	$(id).style.top = newTop+'px';
}
	

function wait() {
	$('dialog').style.zIndex = 999;
	$('error').hide();
	$('wait').show();
}

function toggleConflicts() {
	if ($('conflictsBox').checked) {
		$('available').hide();
		$('all').show();
	} else {
		$('available').show();
		$('all').hide();
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
	$(a).toggle();
	$(b).toggle();
}

function checkAll(divId, all) {
	var elements = $(divId).select('input');
	for (var i =0; i < elements.length; i++) {
		elements[i].checked = all.checked;
	}
}

