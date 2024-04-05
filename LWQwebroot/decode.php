<?php
require_once("../LWQscripts/node-data.php");
$PUBLIC = new NodeData();
$RETURN = (object)array();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header("Content-type: application/json; charset=utf-8");

$post = file_get_contents('php://input');

//echo $post;

$newString = str_replace('"', "", $post);
//echo $newString;

$final = $PUBLIC->decode($RETURN, $newString);

//var_dump($final["vsize"]);
//$final = json_decode($final);


echo json_encode($final["vsize"], JSON_PRETTY_PRINT);