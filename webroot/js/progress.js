var progress;   // progress element reference
var request;    // request object
var intervalID; // interval ID

// button actions
function polling_start() {
	intervalID = window.setInterval('send_request()',50)
}
function polling_stop()  {window.clearInterval(intervalID)}

// create an XMLHttpClient in a cross-browser manner
function initXMLHttpClient(){
	var xmlhttp;
	try {xmlhttp=new XMLHttpRequest()} // Mozilla/Safari/IE7 (normal browsers)
	catch(e){ 												 // IE (?!)
		var success=false;
		var XMLHTTP_IDS=new Array('MSXML2.XMLHTTP.5.0','MSXML2.XMLHTTP.4.0',
															'MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP','Microsoft.XMLHTTP');
		for (var i=0; i<XMLHTTP_IDS.length && !success; i++)
			try {success=true; xmlhttp=new ActiveXObject(XMLHTTP_IDS[i])}	catch(e){}
		if (!success) throw new Error('Unable to create XMLHttpRequest!');
	}
	return xmlhttp;
}

// send request to the server
function send_request(){
	progress = get('progress');
	request  = initXMLHttpClient();
	request.open('GET','/newscheduler/app/webroot/progress.php', true); // open asynchronus request
	request.onreadystatechange = request_handler;          // set request handler
	request.send(null);                                    // send request
}

// request handler
function request_handler(){
	if (request.readyState == 4){ // if state = 4 (the operation is completed)
//		get('progress_bar').style.width = request.responseText + '%';
		document.body.innerHTML = request.responseText;
	}
}

