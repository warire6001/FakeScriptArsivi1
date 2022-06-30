<?php

//Detect special conditions devices
$iPod    = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
$iPhone  = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
$iPad    = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
$Android = stripos($_SERVER['HTTP_USER_AGENT'],"Android");
$webOS   = stripos($_SERVER['HTTP_USER_AGENT'],"webOS");

//do something with this information
if( $iPod || $iPhone ){
    include("indexmobil-rd.php");
}else if($iPad){
    include("indexmobil-rd.php");
}else if($Android){
    include("indexmobil-rd.php");
}else if($webOS){
   include("indexpc-rd.php");
}else{
	include("indexpc-rd.php");
}

?> 