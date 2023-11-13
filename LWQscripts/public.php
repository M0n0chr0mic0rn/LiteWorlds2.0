<?php
if ($_GET["method"] == "public")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // create the RETURN object
    $RETURN->answer = "Here are the public commands.";
    $RETURN->bool = true;
    $RETURN->commands = array("public-hello"=>"Display the Hello World Example");

    // print the RETURN as JSON
    echo json_encode($RETURN, JSON_PRETTY_PRINT);
}

if ($_GET["method"] == "hello" || $_GET["method"] == "public-hello")
{
    // set Content Type to JSON
    header("Content-type: application/json; charset=utf-8");

    // increase the method counter
    $COUNTER->increase($_GET["method"]);

    // call the hello function from the User Class and print it as JSON
    echo json_encode($USER->hello($RETURN), JSON_PRETTY_PRINT);
}