<?php
require_once("../LWQscripts/node-data.php");
$PUBLIC = new NodeData();
$RETURN = (object)array();

header('Access-Control-Allow-Origin: *');
header("Content-type: application/json; charset=utf-8");

$post = file_get_contents('php://input');

//echo $post;

$newString = str_replace('"', "", $post);
//echo $newString;

$final = $PUBLIC->mempoolSubmit($RETURN, $newString);

//var_dump($final);

echo json_encode($final, JSON_PRETTY_PRINT);