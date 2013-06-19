lastReceived=0;
var logID;

function initialChatLogStatus(){
    //    logInArea.style.display="none";
    //    chatArea.style.display="none";

    // is there a cookie with a login name?
    logID=$.cookies.get('loginID');
    if (logID) { // if yes, then ask the server if the id still exists
       Ajax_Send("POST","users2.php","user="+logID+"&oper=checkID",checkInitialSignIn);
    }
    else { // if not, then show the login area
	logInArea.style.display="block";
	chatArea.style.display="none";
    }
}

function checkInitialSignIn(res) {
    // if the logID from the cookie is also on the server then we can make 
    // the chat window visible, else make the login area visible 
    // remove cookie first
    logID=$.cookies.get('loginID');
    $.cookies.del('loginID');
    //    return false;

    if(res=="userexists") {
	logInArea.style.display="none";
	chatArea.style.display="block";
	response_msg.innerHTML="Signed in with ";
	response_msg.innerHTML="Signed in with "+logID
	logOutButton.value="Log Out "+logID;
	$.cookies.set('loginID',logID);
	messageForm.message.focus();
	updateInterval=setInterval("updateMessages()",3000);
    }
    if(res=="userdoesnotexist") logInArea.style.display="block";
}

// Sign in 
function logInProc(){
    // check to see if the username selected is well formed
    if (logInForm.userName.value=="" || 
	logInForm.userName.value.indexOf(" ")>-1){
	 alert("Not valid user name\nPlease make sure your user name didn't contains a space\nOr it's not empty.");
	 logInForm.userName.focus();
	 return false;
    }

    // talk to the server and sign in
    logID=logInForm.userName.value;
    response_msg.innerHTML="valid name, sending to server";
    data="user=" + logInForm.userName.value +"&oper=signin"
	Ajax_Send("POST","users2.php",data,checkSignIn);
    return false;
}

// deal with response to the signin resquest 
function checkSignIn(res){
    if(res=="userexist"){
	alert("The username you typed already exists\nPlease try another one");
	return false;
    }
    if(res=="signin"){
	logInArea.style.display="none";
	chatArea.style.display="block";
	response_msg.innerHTML="Signed in with ";
	response_msg.innerHTML="Signed in with "+logID
	logOutButton.value="Log Out "+logID;
	$.cookies.set('loginID',logID);
	messageForm.message.focus();
	updateInterval=setInterval("updateMessages()",3000);
    }
}


function windowClose(){
    logOutProc();
    return null;
}

// Sign out
function logOutProc(){
    data="user=" + logID +"&oper=signout"
	Ajax_Send("POST","users2.php",data,checkSignOut);
    return false;
}

// Sign out response
function checkSignOut(res){
    if(res=="usernotfound"){
	//serverRes.innerHTML="Sign out error";
	res="signout"
	    }
    if(res=="signout"){
	$.cookies.del('loginID');
	logInArea.style.display="block";
	chatArea.style.display="none";
	logInForm.userName.focus();
	clearInterval(updateInterval);
	//serverRes.innerHTML="Sign out"
	return false;
    }
}


//update the message box
function updateMessages() {
    Ajax_Send("POST","receive.php","lastreceived="+lastReceived,showMessages)
}

// Update messages view
function showMessages(res){
    //serverRes.innerHTML=""
    msgTmArr=res.split("<SRVTM>");
    lastReceived=msgTmArr[1];
    messages=document.createElement("span");
    messages.innerHTML=msgTmArr[0];
    oldMessages.appendChild(messages);
    oldMessages.scrollTop=oldMessages.scrollHeight;
}

// on click on "Send" button on return in message window, send message
function sendMessage(){
    data="message="+messageForm.message.value+"&user="+logID;
    //serverRes.innerHTML="Sending"
    Ajax_Send("POST","send.php",data,sentOk);
}

// message has been Sent Ok
function sentOk(res){
    if(res=="sentok"){
	messageForm.message.value="";   // clear the message window 
	messageForm.message.focus();    // and ensure the focus is still on it
	updateMessages();
    //serverRes.innerHTML="Sent"
}
else{
    //serverRes.innerHTML="Not sent"
}
}

// if you don't have a chat id in a cookie on pageload then set up with a 
// login box. If you have a chat id, then verify it (in case it is stale). 
// If it is fresh then use that one. Otherwise erase cookie and set up with 
//a login box. 