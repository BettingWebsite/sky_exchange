<?php 
session_start(); 
if ($_POST["vercode"] != $_SESSION["vercode"] OR $_SESSION["vercode"]=='')  { 
     echo  'Incorrect verification code.'; 
     // echo $_POST["vercode"];
} else { 
     // add form data processing code here 
     echo  'Successful'; 
}; 
?>