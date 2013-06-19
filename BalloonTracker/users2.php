<?php

function saveUsers($onlineusers_file){
$file_save=fopen("onlineusers.txt","w+");
flock($file_save,LOCK_EX);
for($line=0;$line<count($onlineusers_file);$line++){
fputs($file_save,$onlineusers_file[$line]."\n");
};
flock($file_save,LOCK_UN);
fclose($file_save);
}

// read the user file and see if the "user" and "oper" keys are set
// if so, find out if and where the user is in the user file, and do the 
// indicated operation 

$onlineusers_file=file("onlineusers.txt",FILE_IGNORE_NEW_LINES);
if (isset($_POST['user'],$_POST['oper'])){
$user=$_POST['user'];
$oper=$_POST['oper'];
$userexist=in_array($user,$onlineusers_file);
if ($userexist)$userindex=array_search($user,$onlineusers_file);

// now start doing the possible operations that the client might ask

if ($oper=="checkID") {
   if ($userexist==true){
      echo "userexists";
   } else {
      echo "userdoesnotexist";
   }
   exit();
}

if ($oper=="signin") {
   if ($userexist==true) {		// name already taken!
      echo "userexist";
   } else {				// signed up
      $onlineusers_file[]=$user;
      saveUsers($onlineusers_file);
      echo "signin";
   }
   exit();
}  

if ($oper=="signout") {
   if ($userexist==true) {		// signed out
      array_splice($onlineusers_file,$userindex,1);
      saveUsers($onlineusers_file);
      echo "signout";
   } else {				// signing out non-existant user
     echo "usernotfound";
   }
   exit();
}  


}

// send list of online users in case the client wants these
// $olu=join("<br>",$onlineusers_file);
// echo $olu;

?>

